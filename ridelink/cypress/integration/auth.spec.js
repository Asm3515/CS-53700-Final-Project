describe('Authentication Tests', () => {
    it('Should log in a user', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  
    it('Should log out a user', () => {
      cy.get('.logout-button').click();
      cy.url().should('eq', 'http://localhost:3000/login');
    });
  });
  