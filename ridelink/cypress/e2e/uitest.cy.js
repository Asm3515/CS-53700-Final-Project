describe('UI Tests', () => {
    it('should display Navbar correctly', () => {
      cy.visit('https://ridelink-public.vercel.app/');
      cy.get('nav').should('be.visible');
      cy.get('img[alt="RideLink logo').should('exist');
    });
  
    it('should display Footer correctly', () => {
      cy.visit('https://ridelink-public.vercel.app/');
      cy.get('footer').should('be.visible');
      cy.get('p').contains(`© ${new Date().getFullYear()} RideLink. All rights reserved.`).should('exist');
    });
  });