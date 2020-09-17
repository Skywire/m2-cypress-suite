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

describe('Critical Path - Checkout', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('PHPSESSID');
    });

    beforeEach(() => {
        setupCart(['radiantTeeAddToCart']);
    });

    it('Guest Checkout', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        cy.get('input[name="username"]:visible').type('a@a.com');

        cy.get('.continue[type="submit"]:first').click();

        addressHandler(shippingAddress);

        // cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');
        // cy.get('#shipping-method-buttons-container :input[type="submit"]').click();
        cy.get(':input[type="submit"]:visible').click();

        cy.contains('Payment Method');
        // cy.get('#checkmo:visible').check();
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');

        cy.get('button.checkout[type="submit"]:visible').click();

        cy.contains('Thank you for your purchase!');
        cy.contains('Create an Account');
    });

    it('Guest Checkout with step traversal', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        cy.get('input[name="username"]:visible').type('a@a.com');
        cy.get('.continue[type="submit"]:first').click();

        addressHandler(shippingAddress);

        // goto payment step
        cy.get(':input[type="submit"]:visible').click();
        cy.contains('Payment Method');

        // go back to shipping
        cy.get('.opc-progress-bar-item-shipping').click();
        cy.contains('Shipping Address');

        // back to payment
        cy.get(':input[type="submit"]:visible').click();
        cy.contains('Payment Method');
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');

        cy.get('button.checkout[type="submit"]:visible').click();

        cy.contains('Thank you for your purchase!');
        cy.contains('Create an Account');
    });
})
