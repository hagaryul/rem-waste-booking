import testData from "../fixtures/test-data.json";

describe("Heavy Waste & Plasterboard Booking Flow", () => {
  beforeEach(() => {
    cy.resetBookings();
    cy.visit("http://localhost:3000");
  });

  it("completes full heavy waste booking flow with disabled skips", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.heavy);
    cy.completeStep2Heavy();

    cy.get(`[data-cy="skip-option-${testData.skips.disabled_heavy_1}"]`).should(
      "be.disabled",
    );
    cy.get(`[data-cy="skip-option-${testData.skips.disabled_heavy_2}"]`).should(
      "be.disabled",
    );
    cy.get('[data-cy="disabled-label"]').should("have.length", 2);

    cy.completeStep3(testData.skips.small);
    cy.get('[data-cy="review-summary"]').should("contain", "Yes");
    cy.completeStep4();
  });

  it("completes plasterboard flow with separate collection", () => {
    cy.completeStep1(
      testData.postcodes.valid,
      testData.addresses.plasterboard_separate,
    );
    cy.completeStep2Plasterboard("separate");
    cy.completeStep3(testData.skips.medium);
    cy.completeStep4();
  });

  it("completes plasterboard flow with mixed waste", () => {
    cy.completeStep1(
      testData.postcodes.valid,
      testData.addresses.plasterboard_mixed,
    );
    cy.completeStep2Plasterboard("mixed");
    cy.completeStep3(testData.skips.large);
    cy.completeStep4();
  });

  it("completes plasterboard flow with dedicated skip", () => {
    cy.completeStep1(
      testData.postcodes.valid,
      testData.addresses.plasterboard_collection,
    );
    cy.completeStep2Plasterboard("collection");
    cy.completeStep3(testData.skips.xl);
    cy.completeStep4();
  });

  it("blocks next if plasterboard selected but no option chosen", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.get('[data-cy="plasterboard-checkbox"]').check();
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="error-message"]').should("be.visible");
  });

  it("prevents double submit", () => {
    cy.completeStep1(
      testData.postcodes.valid,
      testData.addresses.double_submit,
    );
    cy.completeStep2Heavy();
    cy.completeStep3(testData.skips.small);
    cy.completeStep4();
    cy.get('[data-cy="confirm-button"]').should("not.exist");
  });

  it("back button from skip select returns to waste type", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.completeStep2Heavy();
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="heavy-checkbox"]').should("be.visible");
  });

  it("back button from review returns to skip select", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.completeStep2General();
    cy.completeStep3(testData.skips.small);
    cy.get('[data-cy="back-button"]').click();
    cy.get(`[data-cy="skip-option-${testData.skips.small}"]`).should(
      "be.visible",
    );
  });

  it("next button disabled until skip selected", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.completeStep2General();
    cy.get('[data-cy="next-button"]').should("be.disabled");
  });

  it("price breakdown shows correct VAT calculation", () => {
    cy.completeStep1(testData.postcodes.valid, testData.addresses.general);
    cy.completeStep2General();
    cy.completeStep3(testData.skips.small);
    cy.get('[data-cy="price-breakdown"]').should("contain", "£120.00");
    cy.get('[data-cy="price-breakdown"]').should("contain", "£24.00");
    cy.get('[data-cy="price-breakdown"]').should("contain", "£144.00");
  });
});
