const setupCart = require('../functions/checkout/setupCart');
const addressHandler = require('../functions/checkout/populateAndVerifyAddress')
const shippingAddress = {
    firstname: "Randy",
    lastname: "Savage",
    country_id: 'GB',
    street: "123 Fake St",
    city: "FakeTown",
    postcode: 'A1 1AA',
    telephone: '01234567890',
}

const billingAddress = {
    firstname: "Randy",
    lastname: "Savage",
    country_id: 'GB',
    street: "256 Fake St",
    city: "FakeTown",
    postcode: 'B2 2BB',
    telephone: '01234567890',
}

describe('Critical Path - Checkout', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('PHPSESSID');
    });

    before(() => {
        setupCart(['radiantTeeAddToCart']);
    });

    it.only('Guest - Different Billing and Shipping', () => {
        cy.visit('/checkout');

        // login
        cy.get('input[name="username"]:visible').type('a@a.com');
        cy.get('.continue[type="submit"]:first').click();

        // shipping
        addressHandler(shippingAddress);
        // cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');
        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        // billing
        cy.contains('Payment Method');
        cy.get('#checkmo').check();
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked').uncheck();
        addressHandler(billingAddress);
        cy.get('.action-update').click();
        cy.get('button.checkout[type="submit"]:visible').click();

        // success
        cy.contains('Thank you for your purchase!');
        cy.contains('Create an Account');
    });
})
