Cypress.on('uncaught:exception', () => false)

describe('Login Assignment flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('Login - Assignment', () => {

    // Log in
    cy.get('input[placeholder="Enter your email"]')
      .type('2022gaokao@gmail.com');

    cy.get('input[placeholder="Enter your password"]')
      .type('123456');

    cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();

    cy.url().should('include', '/perfil');

    // Bio
    cy.get('button[name="Bio"]')
      .click();

    cy.get('textarea[name="BioInput"]')
      .click()
      .type('I am a third-year Computational Technologies Engineering student with a solid foundation in programming,') 
      .type('data analysis, and software design. I have built Android applications using Kotlin and Jetpack Compose, ')
      .type('developed bioinformatics pipelines in Python, and created interactive web interfaces with modern JavaScript ')
      .type('frameworks. I am passionate about artificial intelligence and machine learning; I have explored neural-network-driven ')
      .type('mental health monitoring tools, implemented iterative backtracking algorithms for optimization challenges, ')
      .type('and designed data-driven features for user-focused applications. I am a collaborative team player with a natural ')
      .type('curiosity for emerging AI methods, making me well-suited for roles in machine learning research, model development, ')
      .type('and AI-powered product innovation.')

    cy.get('button[name="saveBio"]')
      .click();

    // Skill
    cy.get('button[name="addSkill"]')
      .contains(/Add new skill/i)
      .click();

    cy.get('input[placeholder="Search"]')
      .click()
      .type('Adaptability');

    cy.get('[name = "skillSuggestions"]')
      .contains('li', /Adaptability$/i)
      .click();

    cy.get('button[name="saveSkill"]')
      .click();

    cy.get('div[name="SkillCard"]')
      .contains(/Adaptability$/i)
      .get('button[title = "Remove skill"][name = "Adaptability"]')
      .click();

    cy.get('div[name="SkillCard"]')
      .should('not.contain', /^Adaptability$/i);

    // Goal
    cy.get('button[name = "addGoal"]')
      .click()

    cy.get('input[name = "goalTitle"]')
      .click()
      .type('Optimize Production-Ready ML Pipeline');

    cy.get('input[name = "goalDate"]')
      .click()
      .type('2025-12-11')   

    cy.get('textarea[name = "goalDescription"]')
      .click()
      .type('Automate end‐to‐end ML workflows—ingest data, train and deploy models, and monitor performance in real time.');

    cy.get('button[type="submit"]')
      .click();

    cy.get('div[name="ProfessionalGoals"]')
      .get('div[name="GoalsCards"]').contains(/Optimize Production-Ready ML Pipeline$/i)
      .get('button[title = "editGoal"][name = "Optimize Production-Ready ML Pipeline"]')

      // Se comentariza para no saturar la Base de Datos con este goal
      // Ya fue probado que funciona correctamente (local en cypress)

      /*
      .click()
      .get('button[name = "deleteGoal"]')
      .click();
      */

    // Se comentariza esta seccion para que no haya problema en GitHubAction para buscar el archivo para subir
    // Ya fue probado que funciona correctamente (local en cypress)
    
    /*
    // CV
    cy.get('button[name="uploadCV"]')
      .click();

    cy.get('input[type="file"]')
      .eq(0) 
      .selectFile('/Users/ytinglin/Downloads/YutingLinCV.pdf', { force: true });
    */
    
    // Log out
    cy.contains('button', /^Logout$/i)
      .scrollIntoView()
      .should('be.visible')
      .click()
  
    cy.url().should('include', '/');

    // Log in Admin
    cy.get('input[placeholder="Enter your email"]')
      .type('A00835917@tec.mx');

    cy.get('input[placeholder="Enter your password"]')
      .type('123456');

    cy.get('button[type="submit"]')
      .contains(/log in/i)
      .click();

    cy.url().should('include', '/perfil');

    // Assignments
    cy.get('div[name="Assignments"]')
      .click();

  });

});