describe('Trial', () => {

  const { cnpj } = require('cpf-cnpj-validator');


    beforeEach(() => {      
      })

    it('Criando trials em loop', () => {
      for (let i = 0; i < 2; i++) {
      cy.visit('https://mastertestdrive.bomcontrole.company/?origem=desktop');
      cy.get('#email').type('teste_reajuste_' + i + '@yopmail.com');
      cy.get('#email-form > .btn-submit').click();
      cy.get('#email-form').submit();
      cy.get('#main-form').should('be.visible');

      //Preenchimento dos campos do formulário principal
      cy.get('#nomeEmpresa').type('Testes Gerais Empresa ' + i);
      cy.get('#nome').type('Testes Gerais Usuário '+ i);
      cy.get('#telefone').type('(11) 97584-1258');
      cy.get('#desafio').select('Gestão Financeira');
      cy.get('.checkbox-custom-label').click();      

      //Confirmando criação do trial e validando sucesso
      cy.get('[class="btn-submit"]').contains('Iniciar teste grátis').click();
      cy.wait(15000); //Futuramente tentar obter resultado do job ao invés de aguardar por tempo
      cy.get('[class="geral-container sucesso-container "]').should('be.visible');    
      }
    })
})