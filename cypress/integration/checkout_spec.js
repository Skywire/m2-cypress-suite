import setupCart from "../functions/setupCart";

const shippingAddress = {
    firstname: "Randy",
    lastname: "Savage",
    country_id: 'GB',
    street: "123 Fake St",
    city: "FakeTown",
    postcode: 'A1 1AA',
    telephone: '01234567890',
}

describe('Checkout - Critical Path - Guest', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('PHPSESSID');
    });

    before(() => {
        const setupCart = require('./../functions/setupCart');

        setupCart(['radiantTeeAddToCart.json']);
    });

    it('View Cart', () => {
        cy.visit('/checkout/cart').contains('Proceed to Checkout');
    });

    it.only('Checkout', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        cy.get('input[name="username"]:visible').type('a@a.com');

        cy.get('.continue[type="submit"]:first').click();

        Object.entries(shippingAddress).forEach((keyValuePair) => {
            let [field, value] = keyValuePair;
            let selector = `:input[name^="${field}"]:visible`;

            if (field === 'country_id') {
                cy.get(selector).select(value);
            } else {
                cy.get(selector).type(value);
            }

            cy.get(selector).should('have.value', value);
        });

        cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');

        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        cy.contains('Payment Method');

        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');

        cy.get('button.checkout[type="submit"]:visible').click();

        cy.contains('Thank you for your purchase!');
    });
})