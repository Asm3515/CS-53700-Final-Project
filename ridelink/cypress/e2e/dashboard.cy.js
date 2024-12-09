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
    cy.get("button").contains("Get Started").click();
    cy.url().should("not.include", "/dashboard");
  });
});
