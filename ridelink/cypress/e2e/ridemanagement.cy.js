describe('Ride Management', () => {
    it('should allow finding a ride', () => {
      cy.visit('https://ridelink-public.vercel.app/rides/findrides');
      cy.get('input[name="pickup"]').type('Fort Wayne, Indiana, United States');
      cy.get('input[name="destination"]').type('Chicago, Illinois, United States');
      cy.get('button[type="submit"]').click();
      cy.contains('Available Rides').should('be.visible');
    });
  
    it('should allow booking a ride', () => {
      cy.visit('https://ridelink-public.vercel.app/rides/requestride');
      cy.get('input[name="rideId"]').type('1');
      cy.get('button[type="submit"]').click();
      cy.contains('Booking Successful').should('be.visible');
    });
  });