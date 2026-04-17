import testData from "../fixtures/test-data.json";

describe("General Waste Booking Flow", () => {
  beforeEach(() => {
    cy.resetBookings();
    cy.visit("http://localhost:3000");
  });

  it("completes full general waste booking flow", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.completeStep2General();
    cy.completeStep3(testData.skips.small);
    cy.completeStep4();
  });

  it("shows empty state for EC1A 1BB", () => {
    cy.get('[data-cy="postcode-input"]').type(testData.postcodes.empty);
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="empty-state"]').should("be.visible");
    cy.get('[data-cy="next-button"]').should("be.disabled");
  });

  it("shows error and retry for BS1 4DJ", () => {
    cy.get('[data-cy="postcode-input"]').type(testData.postcodes.error);
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="error-message"]').should("be.visible");
    cy.get('[data-cy="retry-button"]').click();
    cy.get('[data-cy="address-select"]').should("be.visible");
  });

  it("validates invalid postcode", () => {
    cy.get('[data-cy="postcode-input"]').type("INVALID");
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="error-message"]').should("be.visible");
    cy.get('[data-cy="next-button"]').should("be.disabled");
  });

  it("validates empty postcode", () => {
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="error-message"]').should("be.visible");
  });

  it("allows manual address entry", () => {
    cy.get('[data-cy="postcode-input"]').type(testData.postcodes.valid);
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="address-select"]').should("be.visible");
    cy.get('[data-cy="manual-entry-toggle"]').click();
    cy.get('[data-cy="manual-address-input"]').type("5 Custom Street, London");
    cy.get('[data-cy="next-button"]').should("not.be.disabled");
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="general-checkbox"]').should("be.visible");
  });

  it("back button returns to previous step", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="postcode-input"]').should("be.visible");
  });

  it("next button disabled until address selected", () => {
    cy.get('[data-cy="postcode-input"]').type(testData.postcodes.valid);
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="address-select"]').should("be.visible");
    cy.get('[data-cy="next-button"]').should("be.disabled");
  });

  it("shows loading state for M1 1AE", () => {
    cy.get('[data-cy="postcode-input"]').type(testData.postcodes.slow);
    cy.get('[data-cy="lookup-button"]').click();
    cy.get('[data-cy="loading-state"]').should("be.visible");
    cy.get('[data-cy="address-select"]', { timeout: 10000 }).should(
      "be.visible",
    );
  });
});
