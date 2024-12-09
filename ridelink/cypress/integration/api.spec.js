describe('API Tests', () => {
    it('Should fetch shuttle schedules', () => {
      cy.intercept('GET', '/api/schedules', { fixture: 'schedules.json' }).as('getSchedules');
      cy.visit('http://localhost:3000/schedules');
      cy.wait('@getSchedules');
      cy.get('.schedule-item').should('have.length.at.least', 1);
    });
  });
  