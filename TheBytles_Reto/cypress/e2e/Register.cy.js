Cypress.on('uncaught:exception', () => false)

describe('Register account', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('Register', () => {

    // Sign up
    cy.contains('button', /^Sign up$/i)
      .scrollIntoView()
      .should('be.visible')
      .click()
    
    cy.url().should('include', '/signup');

    cy.contains(/Create your account/i)
        .should('be.visible');

    // Register unsuccessfully

    // Empty all
    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();
    
    cy.get('input[name="firstname"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
      });

    // Empty First Name
    cy.get('input[name="lastname"]')
      .type('Lyn');

    cy.get('input[name="email"]')
      .type('lynlyt.86@gmail.com');

    cy.get('select[name="capability"]')
      .select('Data Science and Big Data', { force: true })
      .should('have.value', 'Data Science and Big Data');

    cy.get('select[name="carrerlevel"]')
      .select('10', { force: true })
      .should('have.value', '10');

    cy.get('select[name="atc"]')
      .select('QRO', { force: true })
      .should('have.value', 'QRO');

    cy.get('input[name="since"]')
      .type('2022-06-08') 

    cy.get('input[name="password"]')
      .type('123456');

    cy.get('input[name="repeatpassword"]')
      .type('123456')

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();
    
    cy.get('input[name="firstname"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
      });

    // Empty Lastname
    cy.get('input[name="firstname"]')
      .clear()
      .type('Yu');

    cy.get('input[name="lastname"]')
      .clear();

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('input[name="lastname"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
        });

    // Empty Email
    cy.get('input[name="lastname"]')
      .clear()
      .type('Lyn');

    cy.get('input[name="email"]')
      .clear();

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('input[name="email"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
        });

  // Empty Capability
    cy.get('input[name="email"]')
    .clear()
    .type('lynlyt.86@gmail.com');

    cy.get('select[name="capability"]')
      .select('Select Capability')
      .should('have.value', '');

    cy.get('button[type="submit"]')
    .contains(/Sign Up/i)
    .click();

    cy.get('select[name="capability"]')
      .then($select => {
      const el = $select[0];
      expect(el.checkValidity()).to.be.false;
      expect(el.validationMessage)
        .to.equal('Please select an item in the list.');
      });

    // Empty Carrer Level
    cy.get('select[name="capability"]')
      .select('Data Science and Big Data')
      .should('have.value', 'Data Science and Big Data');

    cy.get('select[name="carrerlevel"]')
      .scrollIntoView()
      .select('Select Career Level')
      .should('have.value', '');

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('select[name="carrerlevel"]')
      .then($select => {
        const el = $select[0];
        expect(el.checkValidity()).to.be.false;
        expect(el.validationMessage)
          .to.equal('Please select an item in the list.');
      });

    // Empty ATC
    cy.get('select[name="carrerlevel"]')
      .select('10')
      .should('have.value', '10');

    cy.get('select[name="atc"]')
      .scrollIntoView()
      .select('Select ATC')
      .should('have.value', '');

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('select[name="atc"]')
      .then($select => {
        const el = $select[0];
        expect(el.checkValidity()).to.be.false;
        expect(el.validationMessage)
          .to.equal('Please select an item in the list.');
      });

    // Empty Start Working In
    cy.get('select[name="atc"]')
      .select('QRO', { force: true })
      .should('have.value', 'QRO');

    cy.get('input[name="since"]')
      .clear()

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('input[name="since"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
        });
    
    // Empty Password
    
    cy.get('input[name="since"]')
      .type('2022-06-08') 

    cy.get('input[name="password"]')
      .clear();

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('input[name="password"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
      });

    // Empty Repeat Password
    cy.get('input[name="password"]')
      .clear()
      .type('123456');

    cy.get('input[name="repeatpassword"]')
      .clear();

    cy.get('button[type="submit"]')
      .contains(/Sign Up/i)
      .click();

    cy.get('input[name="repeatpassword"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false;
        expect($input[0].validationMessage)
          .to.equal('Please fill out this field.');
      });


    // First name with num
    cy.get('input[name="repeatpassword"]')
      .clear()
      .type('123456');

    cy.get('input[name="firstname"]')
      .clear()
      .type('123456')
      .blur()
      .then($input => {
        const el = $input[0];
        expect(el.checkValidity()).to.be.false;
        expect(el.validationMessage).to.satisfy(msg =>
          /Please match the requested format\./.test(msg) ||
          /Please enter only letters/.test(msg)
        );
      });

      // First name with num y text
      cy.get('input[name="firstname"]')
        .clear()
        .type('123456Aa')
        .blur()
        .then($input => {
          const el = $input[0];
          expect(el.checkValidity()).to.be.false;
          expect(el.validationMessage).to.satisfy(msg =>
            /Please match the requested format\./.test(msg) ||
            /Please enter only letters/.test(msg)
          );
        });

      // Last name with num
      cy.get('input[name="firstname"]')
        .clear()
        .type('Yu');

      cy.get('input[name="lastname"]')
        .clear()
        .type('123456')
        .blur()
        .then($input => {
          const el = $input[0];
          expect(el.checkValidity()).to.be.false;
          expect(el.validationMessage).to.satisfy(msg =>
            /Please match the requested format\./.test(msg) ||
            /Please enter only letters/.test(msg)
          );
        });

        // Last name with num y text
        cy.get('input[name="lastname"]')
          .clear()
          .type('123456Aa')
          .blur()
          .then($input => {
            const el = $input[0];
            expect(el.checkValidity()).to.be.false;
            expect(el.validationMessage).to.satisfy(msg =>
              /Please match the requested format\./.test(msg) ||
              /Please enter only letters/.test(msg)
            );
          });

        cy.get('input[name="lastname"]')
          .clear()
          .type('Lyn');

    });
});