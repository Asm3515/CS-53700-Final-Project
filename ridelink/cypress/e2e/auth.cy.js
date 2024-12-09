// describe('Authentication Tests', () => {
//     it('Should log in a user', () => {
//       cy.visit('https://ridelink-public.vercel.app/sign-in');
//       cy.get('input[name="email"]').type('rahul.bandi97@gmail.com');
//       cy.get('input[name="password"]').type('fullstack@pfw');
//       cy.get('button[type="submit"]').click();
//       cy.url().should('include', '/dashboard');
//     });
  
//     it('Should log out a user', () => {
//       cy.get('.SignOutButton').click();
//       cy.url().should('eq', 'https://ridelink-public.vercel.app/sign-in');
//     });
//   });
  