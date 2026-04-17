declare global {
  namespace Cypress {
    interface Chainable {
      resetBookings(): Chainable<void>;
      completeStep1(postcode: string, addressId: string): Chainable<void>;
      completeStep2General(): Chainable<void>;
      completeStep2Heavy(): Chainable<void>;
      completeStep2Plasterboard(
        option: "separate" | "mixed" | "collection",
      ): Chainable<void>;
      completeStep3(skipSize: string): Chainable<void>;
      completeStep4(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("resetBookings", () => {
  cy.log("🔄 Resetting booking store");
  cy.request("POST", "http://localhost:3000/api/test/reset").then((res) => {
    cy.log(`✅ Reset complete — status: ${res.status}`);
  });
});

Cypress.Commands.add("completeStep1", (postcode: string, addressId: string) => {
  cy.log(`📍 Step 1 — Entering postcode: ${postcode}`);
  cy.get('[data-cy="postcode-input"]').type(postcode);
  cy.get('[data-cy="lookup-button"]').click();
  cy.log("🔍 Waiting for address dropdown...");
  cy.get('[data-cy="address-select"]').should("be.visible");
  cy.log(`🏠 Selecting address: ${addressId}`);
  cy.get('[data-cy="address-select"]').select(addressId);
  cy.get('[data-cy="next-button"]').click();
  cy.log("➡️ Step 1 complete");
});

Cypress.Commands.add("completeStep2General", () => {
  cy.log("🗑️ Step 2 — Selecting General Waste");
  cy.get('[data-cy="general-checkbox"]').check();
  cy.get('[data-cy="next-button"]').click();
  cy.log("➡️ Step 2 complete — General Waste");
});

Cypress.Commands.add("completeStep2Heavy", () => {
  cy.log("🏗️ Step 2 — Selecting Heavy Waste");
  cy.get('[data-cy="heavy-checkbox"]').check();
  cy.get('[data-cy="next-button"]').click();
  cy.log("➡️ Step 2 complete — Heavy Waste");
});

Cypress.Commands.add("completeStep2Plasterboard", (option) => {
  cy.log(`🧱 Step 2 — Selecting Plasterboard with option: ${option}`);
  cy.get('[data-cy="plasterboard-checkbox"]').check();
  cy.get('[data-cy="plasterboard-options"]').should("be.visible");
  cy.get(`[data-cy="plasterboard-option-${option}"]`).check();
  cy.get('[data-cy="next-button"]').click();
  cy.log("➡️ Step 2 complete — Plasterboard");
});

Cypress.Commands.add("completeStep3", (skipSize: string) => {
  cy.log(`🚛 Step 3 — Selecting skip: ${skipSize}`);
  cy.get(`[data-cy="skip-option-${skipSize}"]`).should("be.visible");
  cy.get(`[data-cy="skip-option-${skipSize}"]`).click();
  cy.get('[data-cy="next-button"]').click();
  cy.log("➡️ Step 3 complete");
});

Cypress.Commands.add("completeStep4", () => {
  cy.log("📋 Step 4 — Reviewing and confirming booking");
  cy.get('[data-cy="review-summary"]').should("be.visible");
  cy.get('[data-cy="price-breakdown"]').should("be.visible");
  cy.log("✅ Review summary and price breakdown visible");
  cy.get('[data-cy="confirm-button"]').click();
  cy.log("🎉 Booking submitted — waiting for confirmation");
  cy.get('[data-cy="booking-confirmation"]').should("be.visible");
  cy.get('[data-cy="booking-id"]')
    .should("contain", "BK-")
    .then((el) => {
      cy.log(`🎫 Booking ID received: ${el.text()}`);
    });
});

// Screenshot on failure
afterEach(function () {
  if (this.currentTest?.state === "failed") {
    const testName = this.currentTest?.title?.replace(/\s+/g, "-") ?? "unknown";
    cy.log(`❌ Test failed: ${testName}`);
    cy.screenshot(`FAILED-${testName}`);
  }
});

export {};
