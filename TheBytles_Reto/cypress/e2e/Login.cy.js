Cypress.on('uncaught:exception', () => false)

describe('Login - Logout', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('Login', () => {

    // Login unsuccessfully
    // Invalid email and password
    cy.get('input[placeholder="Enter your email"]')
      .type('2022gaokaoo@gmail.com');

    cy.get('input[placeholder="Enter your password"]')
      .type('1234567');

    cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();
    
    cy.url().should('include', '/');

    cy.contains(/invalid email or password/i)
      .should('be.visible');
    
    // Valid email, invalid password
    cy.get('input[placeholder="Enter your email"]')
      .clear()
      .type('2022gaokao@gmail.com');

    cy.get('input[placeholder="Enter your password"]')
      .clear()
      .type('1234567');

    cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();

    cy.url().should('include', '/');

    cy.contains(/invalid email or password/i)
      .should('be.visible');

    // Invalid email, valid password
    cy.get('input[placeholder="Enter your email"]')
      .clear()
      .type('2022gaokaoo@gmail.com');

    cy.get('input[placeholder="Enter your password"]')
      .clear()
      .type('123456');

    cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();
    
    cy.url().should('include', '/');

    cy.contains(/invalid email or password/i)
      .should('be.visible');

    // Login successfully
    cy.get('input[placeholder="Enter your email"]')
      .clear()
      .type('2022gaokao@gmail.com');

    cy.get('input[placeholder="Enter your password"]')
      .clear()
      .type('123456');

    cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();

    cy.url().should('include', '/perfil');

    // Logout
    cy.contains('button', /^Logout$/i)
      .scrollIntoView()
      .should('be.visible')
      .click()
    
    cy.url().should('include', '/');

    cy.contains(/Log In to PathExplorer/i)
        .should('be.visible');
  });
  
});