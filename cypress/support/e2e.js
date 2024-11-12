import './commands';
import 'cypress-plugin-tab';
before(() => {
  cy.viewport(1920, 1080);
  /*
  const ambiente = Cypress.env('ambiente');
  const urlBomControle = Cypress.env(ambiente);

  Cypress.env('urlBomControle', urlBomControle);
  Cypress.env('loginBomControle', Cypress.env('loginBomControleAplicacao'));
  Cypress.env('senhaBomControle', Cypress.env('senhaBomControleAplicacao'));
  */
  });