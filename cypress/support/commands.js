//Ignorando erros do front do BomControle
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })

import 'cypress-file-upload';
import 'cypress-plugin-tab';

Cypress.Commands.add('autenticacaoBomControle', () => {
  cy.visit(Cypress.env('baseUrl') + '/login');
  cy.get('#inputEmail').type(Cypress.env('loginBomControle'));
  cy.get('[class="btn btn-login"]').contains("Avançar").click();
  cy.get('[name="senha"]').type(Cypress.env('senhaBomControle'));
  cy.intercept({ method: 'POST', url: 'https://masterbcapi.bomcontrole.company/api/seguranca/token' }).as('respostaLogin');
  cy.get('[class="btn btn-login"]').contains("Entrar").click();
  cy.wait('@respostaLogin').then(({ response }) => {
    expect(response.statusCode).to.equal(200);
  });
});