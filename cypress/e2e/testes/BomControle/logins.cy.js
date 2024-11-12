describe('Testes Gerais - Logins', () => {

    beforeEach(() => {})

    it('Admin - Login correto', () => {
      cy.autenticacaoAdmin();
      cy.get('[class="nav-link text-dark"][href="/Assinantes/Listar"]').should('be.visible');
      //Navegação simples
      cy.get('[class="nav-link text-dark"][href="/Assinantes/Listar"]').should('exist')
    }) 

    it('Admin - Login incorreto', () => {
      cy.autenticacaoAdmin();        
      cy.get('[class="text-danger"]').should('have.text', "Usuário e/ou senha inválido(s)");
    })  

    it('BomControle - Login correto', () => {
      cy.autenticacaoBomControle();
      //Deslogando do sistema
      cy.get('#imgHeaderUsuario').click();      
      cy.get('[href="/logout"]').click();
      //Validando se direcionou novamente para o login
      cy.url().should('be.equal', 'https://masterbcui.bomcontrole.company/login');
    }) 

    it('BomControle - Login incorreto', () => {
      cy.visit('https://masterbcui.bomcontrole.company/');
      //Preenchendo dados de login com senha incorreta
      cy.get('#inputEmail').type('henrique.viciedo@yopmail.com{enter}')
      cy.get('[name="senha"]').type('senhaerrada123')  
      //Interceptando resposta do endpoint que gera o token
      cy.intercept({ method: 'POST', url: 'https://masterbcapi.bomcontrole.company/api/seguranca/token'}).as('respostaLogin')
      cy.get('[class="btn btn-login"]').click()
      //Validando se o status code do endpoint interceptado é igual a 400
      cy.wait('@respostaLogin').then(({response }) => {
        expect(response.statusCode).to.equal(400);
      })  
    })

    it('Portal BPO - Login correto', () => {
      cy.intercept('GET', 'https://masterbcapiconvidados.bomcontrole.company/convidado/bpo/administrativo/obterconfiguracao').as('obterConfiguracaoBPO');
      cy.visit('https://masterbpo.bomcontrole.company/login');
      cy.wait('@obterConfiguracaoBPO');
      cy.get('#email').type('cypress_bpo@yopmail.com');
      cy.get('#senha').type('Bc021221@');
      cy.intercept('POST', 'https://masterbcapiconvidados.bomcontrole.company/convidado/bpo/seguranca/token').as('loginBpo');
      cy.get('[type="submit"]').click();
      cy.wait('@loginBpo').then(({response }) => {
        expect(response.statusCode).to.equal(200);
      })
    })

    it('Portal BPO - Login incorreto', () => {
      //Usuário que não é convidado
      cy.visit('https://masterbpo.bomcontrole.company/login');
      cy.get('#email').click({force: true});
      cy.get('#email').type('cypress.bpo@yopmail.com');
      cy.get('#senha').type('Bc021221@');
      cy.intercept('POST', 'https://masterbcapiconvidados.bomcontrole.company/convidado/bpo/seguranca/token').as('loginBpo');
      cy.get('[type="submit"]').click();
      cy.wait('@loginBpo').then(({response }) => {
        expect(response.statusCode).to.equal(400);
      })
      //Usuário convidado com senha errada
      cy.visit('https://masterbpo.bomcontrole.company/login');
      cy.get('#email').type('cypress_bpo@yopmail.com');
      cy.get('#senha').type('senhaerrada');
      cy.get('[type="submit"]').click();
      cy.wait('@loginBpo').then(({response }) => {
        expect(response.statusCode).to.equal(400);
      })
    })

    it('BC360 - Login correto', () => {
      cy.visit('https://mastercontabilidadeui.bomcontrole.company/login');
      cy.get('#email').type('cypress_bc360@yopmail.com');
      cy.get('#senha').type('Bc021221@');
      cy.intercept('POST', 'https://masterbcapiconvidados.bomcontrole.company/convidado/seguranca/token').as('loginBC360');
      cy.get('[type="submit"]').click();
      cy.wait('@loginBC360').then(({response }) => {
        expect(response.statusCode).to.equal(200);
      })
    })

    it('BC360 - Login incorreto', () => {
      cy.visit('https://mastercontabilidadeui.bomcontrole.company/login');
      cy.get('#email').type('cypress_bc360@yopmail.com');
      cy.get('#senha').type('senhaErrada123');
      cy.intercept('POST', 'https://masterbcapiconvidados.bomcontrole.company/convidado/seguranca/token').as('loginBC360');
      cy.get('[type="submit"]').click();
      cy.wait('@loginBC360').then(({response }) => {
        expect(response.statusCode).to.equal(400);
      })
    })

    it('Portal PDV - Login correto', () => {
      cy.visit('https://masterpdv.bomcontrole.company/');
      cy.get('#Autenticacao_Login').type('cypress_pdv@yopmail.com');
      cy.get('#Autenticacao_Senha').type('Bc021221@');
      cy.get('[type="submit"]').click();
      cy.get('[class="flex items-center rounded-xl border border-gray-500 bg-gray-50 p-3 text-gray-600 hover:bg-gray-100"]').should('be.visible');
      cy.get('[class="flex items-center rounded-xl border border-gray-500 bg-gray-50 p-3 text-gray-600 hover:bg-gray-100"]').click();
      cy.get('[class="botao botao-icone"][title="Sair"]').should('be.visible');
      cy.get('[class="botao botao-icone"][title="Sair"]').click();
      cy.get('#Autenticacao_Login').should('be.visible');
    }) 

    it('Portal PDV - Login incorreto', () => {
      cy.visit('https://masterpdv.bomcontrole.company/');
      cy.get('#Autenticacao_Login').type('cypress_pdv@yopmail.com');
      cy.get('#Autenticacao_Senha').type('senhaErrada123');
      cy.get('[type="submit"]').click();
      cy.get('[class="text-center text-red-600"]').should('be.visible');
    })

    it('Portal ServiceDesk - Login correto', () => {
      const apiUrl = 'https://masterbcapiconvidados.bomcontrole.company/convidado';

      cy.visit('https://masterportalui.bomcontrole.company/#/login');
      cy.get('#email').type('cypress_sd@yopmail.com');
      cy.get('#senha').type('Bc021221@');

      cy.intercept('POST', `${apiUrl}/seguranca/token`).as('tokenSD');
      cy.intercept('GET', `${apiUrl}/Usuario/ObterDominios`).as('obterDominiosSD');
      cy.intercept('GET', `${apiUrl}/Usuario/ObterUsuarioLogado`).as('obterUsuarioLogadoSD');
      cy.intercept('GET', `${apiUrl}/Ticket/ObterContadoresDashBoard`).as('obterContadoresDashboardSD');

      cy.get('[type="submit"]').click();

      cy.wait(['@tokenSD', '@obterDominiosSD', '@obterUsuarioLogadoSD', '@obterContadoresDashboardSD'])
        .then((interceptions) => {
          interceptions.forEach(({ response }) => {
            expect(response.statusCode).to.equal(200);
          });
        });

      cy.get('[href="#/logout"]').click();
      cy.get('#email').should('exist').and('be.visible');
      cy.get('#senha').should('exist').and('be.visible');
    });
    
    it('Portal ServiceDesk - Login incorreto', () => {
      cy.visit('https://masterportalui.bomcontrole.company/#/login');
      cy.get('#email').type('cypress_sd@yopmail.com');
      cy.get('#senha').type('senhaErradas123');

      cy.intercept('POST', 'https://masterbcapiconvidados.bomcontrole.company/convidado/seguranca/token').as('tokenSD');
      
      cy.get('[type="submit"]').click();

      cy.wait('@tokenSD').then(({response }) => {
        expect(response.statusCode).to.equal(400);
      })      
    }) 
    
    /*
    it('Portal Intranet - Login incorreto', () => {
      cy.visit('https://masterintranetui.bomcontrole.company/#/login');
      cy.get('#inputEmail').type('cypress_pdv@yopmail.com');
      cy.get('[type="password"][name="senha"]').type('senhaErrada123');
      cy.get('[type="submit"]').click();
      //cy.get('[class="text-center text-red-600"]').should('be.visible');
    })

    it('Portal Intranet - Login correto', () => {
      cy.visit('https://masterintranetui.bomcontrole.company/#/login');
      cy.get('#Autenticacao_Login').type('cypress_pdv@yopmail.com');
      cy.get('#Autenticacao_Senha').type('Bc021221@');
      cy.get('[type="submit"]').click();
      cy.get('[class="flex items-center rounded-xl border border-gray-500 bg-gray-50 p-3 text-gray-600 hover:bg-gray-100"]').should('be.visible');
      cy.get('[class="flex items-center rounded-xl border border-gray-500 bg-gray-50 p-3 text-gray-600 hover:bg-gray-100"]').click();
      cy.get('[class="botao botao-icone"][title="Sair"]').should('be.visible');
      cy.get('[class="botao botao-icone"][title="Sair"]').click();
      cy.get('#Autenticacao_Login').should('be.visible');
    }) 
    */
   
    it('App Mobile - Login correto', () => {
      cy.request({
        method: 'POST',
        url: 'https://masterbcapiapp.bomcontrole.com.br/app/seguranca/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: true,
        body: {
          username: 'testes_cypress@yopmail.com',
          password: 'Bc021221@',
          idcliente: '76831',
          grant_type: 'password'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
      })
    }) 

    it('App Mobile - Login incorreto', () => {
      cy.request({
        failOnStatusCode: false,
        method: 'POST',
        url: 'https://masterbcapiapp.bomcontrole.com.br/app/seguranca/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: true,
        body: {
          username: 'testes_cypress@yopmail.com',
          password: 'senhaErrada123',
          idcliente: '76831',
          grant_type: 'password'
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error_description).to.eq('Usuário e/ou senha inválido(s)');
      })
    }) 
})