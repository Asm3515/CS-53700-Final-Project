describe('Dashboard Tests', () => {
    before(() => {
      // Log in before tests
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
    });
  
    it('Should display user-specific data', () => {
      cy.contains('Welcome').should('be.visible');
      cy.get('.dashboard-item').should('have.length.at.least', 1);
    });
  });
  