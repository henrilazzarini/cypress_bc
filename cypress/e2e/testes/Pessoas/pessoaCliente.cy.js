describe('Cadastros de pessoas', () => {

    const cnpjEnel = '61.695.227/0001-93';

    beforeEach(() => {
      cy.visit('https://masterbcui.bomcontrole.company/');
      cy.get('#inputEmail').type('henrique.viciedo@yopmail.com{enter}');
      cy.get('[name="senha"]').type('021221');
      cy.intercept({
        method: 'GET',
        url: 'https://masterbcapi.bomcontrole.company/api/PesquisaSistema/Buscar?request.contexto=TerminoImplantacao&request.resposta=false'
      }).as('respostaLogin');
      cy.get('[class="btn btn-login"]').click();
      cy.wait('@respostaLogin').then(({response }) => {
        expect(response.statusCode).to.equal(200);
    })
  })

      it('Teste 01 - Cadastro de Cliente', () => {
        //cy.wait(2000);
        //Acessando a tela de clientes e validando se a pesquisa obteve sucesso
        cy.intercept({
          method: 'GET', 
          url: 'https://masterbcapi.bomcontrole.company/api/Pesquisa/ExecutarPesquisaCliente?request.Paginacao.ItensPorPagina=*&request.Paginacao.NumeroDaPagina=*',
        }).as('pesquisaClientes');
        cy.get('[href="/financeiro/cliente/"]').click({ force: true });
        cy.wait('@pesquisaClientes').then(({response }) => {
          expect(response.statusCode).to.equal(200);
        })
        cy.get('#cliente-cadastrar-novo').click();
        cy.get('#cnpj').type('@cnpjEnel');
        cy.get('#nomeFantasia').click();
        cy.get('#nomeFantasia').type('Nome do Cliente');
        cy.get('#razaoSocial').type('Razão Social');
        cy.get('#isentoInscricaoEstadual').click();
        cy.get('#pj-inscricao-municipal > .form-control').type('123456');
      }) 

      
})