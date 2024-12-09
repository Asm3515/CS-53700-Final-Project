describe("Dashboard Features", () => {
  it("should display Passenger Dashboard correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/passenger/dashboard");
    cy.contains("Passenger Dashboard").should("be.visible");
  });

  it("should display Driver Dashboard correctly", () => {
    cy.visit("https://ridelink-public.vercel.app/drivers/dashboard");
    cy.contains("Driver Dashboard").should("be.visible");
  });

  it("should redirect to Passenger Dashboard on button click", () => {
    cy.visit("https://ridelink-public.vercel.app/");

    // Click the "Get Started" button
    cy.get("button").contains("Get Started").click();

    // Verify redirection to the Passenger Dashboard
    cy.url().should("not.include", "/dashboard");
  });
});
