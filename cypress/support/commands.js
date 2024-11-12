//Ignorando erros do front do BomControle
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })

import 'cypress-file-upload';
import 'cypress-plugin-tab';
const ambiente = Cypress.env('ambiente');

Cypress.Commands.add('autenticacaoBomControle', () => {
  cy.visit(Cypress.env('aplicacao').bomControle[ambiente].url + '/login');
  cy.get('#inputEmail').type(Cypress.env('aplicacao').bomControle[ambiente].login);
  cy.get('[class="btn btn-login"]').contains("Avançar").click();
  cy.get('[name="senha"]').type(Cypress.env('aplicacao').bomControle[ambiente].senha);
  cy.intercept({ method: 'POST', url: 'https://masterbcapi.bomcontrole.company/api/seguranca/token' }).as('respostaLogin');
  cy.get('[class="btn btn-login"]').contains("Entrar").click();
  cy.wait('@respostaLogin').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
  });
});

 Cypress.Commands.add('autenticacaoAdmin', () => {
  cy.visit(Cypress.env('aplicacao').admin[ambiente].url);
  cy.get('#Autenticacao_Login').type(Cypress.env('aplicacao').admin[ambiente].login);
  cy.get('#Autenticacao_Senha').type(Cypress.env('aplicacao').admin[ambiente].senha);
  cy.get('button[type="submit"]').contains('Acessar').click(); 
 });