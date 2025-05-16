Cypress.on('uncaught:exception', () => false)

describe('Login flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('Login', () => {
    cy.get('input[placeholder="Enter your email"]')
      .type('2022gaokao@gmail.com');

    cy.get('input[placeholder="Enter your password"]')
      .type('123456');

      cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();

    cy.url().should('include', '/perfil');
  });
});