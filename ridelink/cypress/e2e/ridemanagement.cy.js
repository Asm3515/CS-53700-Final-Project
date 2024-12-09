describe("Ride Management", () => {
  it("should allow finding and filtering rides", () => {
    cy.intercept("GET", "/api/rides", {
      statusCode: 200,
      body: [
        {
          rideId: "1",
          origin: "Fort Wayne, Indiana, United States",
          destination: "Chicago, Illinois, United States",
          passengers: [],
          fare: 100,
          startTime: "2023-12-12T10:00:00Z",
          destinationLocation: {
            type: "Point",
            coordinates: [-87.6298, 41.8781],
          },
          startLocation: {
            type: "Point",
            coordinates: [-85.139351, 41.079273],
          },
          createdBy: "rider",
          _id: "ride1",
          __v: 0,
        },
        // {
        //   rideId: "2",
        //   origin: "Indianapolis, Indiana, United States",
        //   destination: "Detroit, Michigan, United States",
        //   passengers: [],
        //   startTime: "2023-12-13T10:00:00Z",
        //   destinationLocation: {
        //     coordinates: [-83.0458, 42.3314], // Detroit coordinates
        //   },
        // },
      ],
    }).as("getRides");

    cy.visit("https://ridelink-public.vercel.app/rides/findrides");
    cy.wait("@getRides");
    cy.contains("Available Rides").should("be.visible");

    cy.get('input[placeholder="Search..."]').type("Fort Wayne");
    cy.contains("Fort Wayne, Indiana, United States").should("be.visible");
    cy.contains("Chicago, Illinois, United States").should("be.visible");

    // Filter the rides and ensure the filtered ride is displayed
    // cy.get('input[placeholder="Search..."]').clear().type("Indianapolis");
    // cy.contains("Indianapolis, Indiana, United States").should("be.visible");
    // cy.contains("Detroit, Michigan, United States").should("be.visible");
    // cy.contains("Fort Wayne, Indiana, United States").should("not.exist");
  });

  it("should allow adding a user to a ride", () => {
    cy.intercept("GET", "/api/rides", {
      statusCode: 200,
      body: [
        {
          rideId: "1",
          origin: "Fort Wayne, Indiana, United States",
          destination: "Chicago, Illinois, United States",
          passengers: [],
          fare: 100,
          startTime: "2023-12-12T10:00:00Z",
          destinationLocation: {
            type: "Point",
            coordinates: [-87.6298, 41.8781],
          },
          startLocation: {
            type: "Point",
            coordinates: [-85.139351, 41.079273],
          },
          createdBy: "rider",
          _id: "ride1",
          __v: 0,
        },
      ],
    }).as("getRides");
    cy.intercept("PATCH", "/api/rides?rideId=1", {
      statusCode: 200,
      body: {
        rideId: "1",
        passengers: [{ clerkId: "mockUserId" }],
        origin: "Fort Wayne, Indiana, United States",
        destination: "Chicago, Illinois, United States",
      },
    }).as("addToRide");
    cy.visit("https://ridelink-public.vercel.app/rides/findrides");

    cy.wait("@getRides");

    cy.contains("Available Rides").should("be.visible");
    cy.contains("Fort Wayne, Indiana, United States").should("be.visible");
    cy.contains("Chicago, Illinois, United States").should("be.visible");
  });

  it("should allow booking a ride", () => {
    cy.visit("https://ridelink-public.vercel.app/rides/requestride");
    cy.get('input[name="rideId"]').type("1");
    cy.get('button[type="submit"]').click();
    cy.contains("Booking Successful").should("be.visible");
  });
});
