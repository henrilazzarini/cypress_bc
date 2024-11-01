describe('Assinatura', () => {

    const { cnpj } = require('cpf-cnpj-validator');
  
    beforeEach(() => {      
        })
  
    it('Cancelar assinaturas', () => {

        cy.loginAdmin('master@bomcontrole.com.br', '021221');
        for (let idAssinante = 76862; idAssinante < 76867; idAssinante++) {
            cy.get('[class="nav-link text-dark"][href="/Assinantes/Listar"]').click();
            cy.get('#Pesquisa_Codigo').type(idAssinante);
            cy.get('#Pesquisa_TipoSituacao').select('Ativo');
            cy.get('[class="btn btn-secondary"]').should('have.text', "Buscar").click();
            cy.get('[class="icon-link link-dark"][href="/Assinantes/'+idAssinante+'/Editar"]').click();
            cy.get('.nav > :nth-child(4) > .nav-link').click();
            cy.get('#CancelarPorSolicitacaoCliente_DataCancelamento').type('20/06/2024');
            cy.get('#CancelarPorSolicitacaoCliente_Motivo').type('Cancelamento via automação');
            cy.get('button[type="submit"]').contains('Cancelar').click();
        }            
      })
  })