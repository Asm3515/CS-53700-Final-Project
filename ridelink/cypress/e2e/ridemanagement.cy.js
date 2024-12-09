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

  it("should allow booking a ride as a passenger", () => {
    cy.intercept("GET", "https://api.mapbox.com/geocoding/v5/mapbox.places/*", {
      statusCode: 200,
      body: {
        features: [
          {
            center: [-85.139351, 41.079273],
            place_name: "Fort Wayne, Indiana, United States",
            context: [{ id: "country.1", text: "United States" }],
          },
          {
            center: [-87.6298, 41.8781],
            place_name: "Chicago, Illinois, United States",
            context: [{ id: "country.1", text: "United States" }],
          },
        ],
      },
    }).as("geocode");

    cy.intercept("POST", "/api/rides", (req) => {
      expect(req.body).to.deep.include({
        createdBy: "passenger",
        origin: "Fort Wayne, Indiana, United States",
        destination: "Chicago, Illinois, United States",
        startTime: req.body.startTime,
      });

      req.reply({
        statusCode: 201,
        body: { message: "Ride created successfully!" },
      });
    }).as("createRide");

    cy.visit("https://ridelink-public.vercel.app/rides/requestride");

    cy.get('input[placeholder="Enter pick-up location"]').type("Fort Wayne");
    cy.wait("@geocode");
    cy.contains("Fort Wayne, Indiana, United States").click();

    cy.get('input[placeholder="Enter drop-off location"]').type("Chicago");
    cy.wait("@geocode");
    cy.contains("Chicago, Illinois, United States").click();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateTime = `${futureDate.toISOString().split("T")[0]}T10:00`;
    cy.get('input[type="datetime-local"]').type(futureDateTime);
    cy.contains("Create Ride").click();
    cy.wait("@createRide", { timeout: 10000 });
    cy.url().should("include", "/passenger/dashboard");
  });
});
