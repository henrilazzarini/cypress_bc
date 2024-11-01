describe('Cadastros - Testes Gerais', () => {
    
    const { cnpj } = require('cpf-cnpj-validator');
    let i = 9;

    beforeEach('Realizando o login', () => {
        cy.visit('https://masterbcui.bomcontrole.company/');
        cy.get('#inputEmail').type('testes_henrique@yopmail.com{enter}');
        cy.get('[name="senha"]').type('Bc021221@');
        cy.intercept({ method: 'POST', url: 'https://masterbcapi.bomcontrole.company/api/seguranca/token'}).as('respostaLogin')
        cy.get('[class="btn btn-login"]').click();
        cy.wait('@respostaLogin').then(({response }) => {
        expect(response.statusCode).to.equal(200);
        })
      }) 

    // Função para configurar interceptações de API
    const interceptarPesquisa = (alias, url) => {
        cy.intercept({ method: 'GET', url }).as(alias);
    };
  
    // Função para esperar e validar resposta de interceptação
    const validarResposta = (alias, statusCode, property, value) => {
        cy.wait(alias).then(({ response }) => {
            expect(response.statusCode).to.equal(statusCode);
            if (property && value) {
                expect(response.body.Itens[0]).to.have.property(property, value);
            }
    });
    };
  
    it('Cadastrando empresa', () => {
        const cnpjAleatorio = cnpj.generate();

        interceptarPesquisa(
            'pesquisaEmpresas',
            'https://masterbcapi.bomcontrole.company/api/Pesquisa/ExecutarPesquisaEmpresa?request.Paginacao.ItensPorPagina=*&request.Paginacao.NumeroDaPagina=*'
    );
        cy.get('[href="/financeiro/empresa/boas-vindas"]').click({ force: true });
        cy.get('[ng-click="pularBoasVindas()"]').click();
        validarResposta('@pesquisaEmpresas', 200);

        cy.get('[ng-click="validaCadastro()"][class="btn btn-success"]').should('have.text', "Cadastrar Novo").click({ force: true});

        //Dados Básicos da Empresa
        cy.get('#cnpj').type(cnpjAleatorio);
        cy.get('#nomeFantasia').type('Empresa Testes Gerais - Nome Fantasia');
        cy.get('#razaoSocial').type('Empresa Testes Gerais - Razão Social');
        cy.get('[ng-model="empresa.inscricaoEstadual"]').type('123456789');
        cy.get('[ng-model="empresa.estadoInscricaoEstadual"]').click();
        cy.get('[title="SP"]').should('have.text', "SP").click();
        cy.get('#inscricaoMunicipal').type('258852');
        cy.get('[ng-model="empresa.tipoEmpresa"]').click();
        cy.get('[title="Micro Empreendedor Individual"]').should('have.text', "Micro Empreendedor Individual").click();
        cy.get('[name="telefone"]').type('1140028922');
        cy.get('[ng-model="empresa.sigla"]').click();
        cy.get('[title="T"]').should('have.text', "T").click();
        cy.get('[ng-model="empresa.cor"]').click(); 
        cy.get('[title="Roxo"][class="ng-scope"]').click();

        //Endereço - validação da pesquisa de CNPJ
        cy.get('#endereco-cep').type('01310-100');
        cy.intercept({ method: 'POST', url: 'https://masterbcapi.bomcontrole.company/api/CepAdm/Pesquisar'}).as('consultaCEP')
        cy.tab();        
        cy.wait('@consultaCEP').then(({response }) => {
            expect(response.statusCode).to.equal(200);
        })

         
       // validarResposta('@pesquisaCEP', 200);
        cy.get('#endereco-numero').type('5262');
        cy.get('[ng-model="empresa.cnaeItem"]').click().type('Não informado{enter}');;
    })



/*
    it('Editando empresa', () => {
        interceptarPesquisa('pesquisaEmpresas', 'https://masterbcapi.bomcontrole.company/api/Pesquisa/ExecutarPesquisaEmpresa?request.Paginacao.ItensPorPagina=*&request.Paginacao.NumeroDaPagina=*');
        cy.get('[href="/financeiro/empresa/boas-vindas"]').click({ force: true });
        cy.get('[ng-click="pularBoasVindas()"]').click();    
        validarResposta('@pesquisaEmpresas', 200);
        interceptarPesquisa('pesquisaEmpresaTestesGerais', 'https://masterbcapi.bomcontrole.company/api/Pesquisa/ExecutarPesquisaEmpresa?request.TextoPesquisa=01139226000130&request.Paginacao.ItensPorPagina=*&request.Paginacao.NumeroDaPagina=*');
        cy.get('[ng-model="searchField"][placeholder="Pesquisa por razão social ou CNPJ"]').type('01139226000130{enter}', { force: true });
        validarResposta('@pesquisaEmpresaTestesGerais', 200, 'Documento', '01139226000130'); 
        cy.get('[ng-click="editarEmpresa(data)"][uib-tooltip="Editar"]').click();
        cy.get('#cnpj').type('02855911000126');
        cy.get('#nomeFantasia').type('Empresa Testes Gerais - Nome Fantasia');
        cy.get('#razaoSocial').type('Empresa Testes Gerais - Razão Social');
        cy.get('[ng-model="empresa.inscricaoEstadual"]').type('123456789');
        cy.get('#inscricaoMunicipal').type('258852');
        cy.get('[ng-model="empresa.tipoEmpresa"]').select(1);
        cy.get('[name="telefone"]').type('1140028922');
        cy.get('[ng-model="empresa.sigla"]').select(9);
        cy.get('[ng-model="empresa.cor"]').select('Amarelo'); 
    });

    
        
/*
        cy.get('.ng-animate .select2-chosen:nth-child(2)').click();
        cy.get('.ellipsis').click();
        cy.get('.select2-container-active > .select2-choice > .ng-binding').click();
        cy.get('.ellipsis').click();
        cy.get('.ng-valid-br-phone-number:nth-child(2)').click();
        cy.get('.ng-invalid-br-phone-number:nth-child(2)').type('{backspace}');
        cy.get('.ng-touched-add').type('(11) 4000-1245');
        cy.get('.ng-animate > .select2-choice > .ng-binding').click();
        cy.get('#ui-select-choices-row-5-0 .filtro-relatorio-itens').click();
        cy.get('.select2-container-active > .select2-choice > .ng-binding').click();
        cy.get('#ui-select-choices-row-6-1 .ng-binding').click();
        cy.get('#endereco-cep').dblclick();
        cy.get('#endereco-cep').click();
        cy.get('#endereco-cep').type('09750-230');
        cy.get('#body').click();
        cy.get('#endereco-numero').type('123');
        cy.get('#endereco-complemento').type('Apto 15');
        cy.get('#endereco-bairro').click();
        cy.get('#cnae .row:nth-child(2) b:nth-child(1)').click();
        cy.get('#ui-select-choices-row-7-0 .ellipsis:nth-child(1)').click();
        cy.get('.col-xs-1 > .btn').click();
        cy.get('.ng-invalid > .select2-choice > .ng-binding').click();
        cy.get('.ui-select-choices-row-inner:nth-child(1)').click();
        cy.get('.dropdown > .btn').click();
        cy.get('.dropdown > .btn').click();
        cy.get('[class="text-danger"]').should('have.text', "Usuário e/ou senha inválido(s)");
        */
})

 // Edição de empresa
 //

//Cadastro de empresa
//cy.get('[class="btn btn-success"]').click();

 /*
CADASTRO COM VALIDAÇÕES LEGADO
it('Editando empresa', () => {
        cy.intercept({
            method: 'GET', 
            url: 'https://masterbcapi.bomcontrole.company/api/Pesquisa/ExecutarPesquisaEmpresa?request.Paginacao.ItensPorPagina=*&request.Paginacao.NumeroDaPagina=*'
        }).as('pesquisaEmpresas');
        cy.get('[href="/financeiro/empresa/boas-vindas"]').click({ force: true });
        cy.wait(5000);
        cy.get('[ng-click="pularBoasVindas()"]').click();
        cy.wait('@pesquisaEmpresas').then(({response }) => {
            expect(response.statusCode).to.equal(200);
          })

        cy.intercept({
            method: 'GET',
            url: 'https://masterbcapi.bomcontrole.company/api/Pesquisa/ExecutarPesquisaEmpresa?request.TextoPesquisa=01139226000130&request.Paginacao.ItensPorPagina=*&request.Paginacao.NumeroDaPagina=*'
        }).as('pesquisaEmpresaTestesGerais');
        cy.get('[ng-model="searchField"][placeholder="Pesquisa por razão social ou CNPJ"]').type('01139226000130{enter}', { force: true });
        cy.wait('@pesquisaEmpresaTestesGerais').then(({response }) => {
        expect(response.body.Itens[0]).to.have.property('Documento', '01139226000130');
        })

        cy.get('[ng-click="editarEmpresa(data)"][uib-tooltip="Editar"]').click();        
        cy.get('#cnpj').type('02855911000126');        
        cy.get('#nomeFantasia').type('Empresa Testes Gerais - Nome Fantasia');
        cy.get('#razaoSocial').type('Empresa Testes Gerais - Razão Social');
        cy.get('[ng-model="empresa.inscricaoEstadual"]').type('123456789');
        cy.get('#inscricaoMunicipal').type('258852');
        cy.get('[ng-model="empresa.tipoEmpresa"]').select(1);
        cy.get('[name="telefone"]').type('1140028922');
        cy.get('[ng-model="empresa.sigla"]').select(9);
        cy.get('[ng-model="empresa.cor"]').select('Amarelo');
})


 */