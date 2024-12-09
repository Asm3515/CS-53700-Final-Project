describe('Homepage Tests', () => {
    it('Should load the homepage successfully', () => {
      cy.visit('http://localhost:3000'); // Replace with the actual URL
      cy.contains('RideLink').should('be.visible');
    });
  
    it('Should display navigation links', () => {
      cy.get('nav a').should('have.length', 3); // Adjust count based on actual links
    });
  });
  