const setupCart = require('../functions/checkout/setupCart');
const addressHandler = require('../functions/checkout/populateAndVerifyShippingAddress')
const n98 = require('../functions/n98');

const shippingAddress = {
    firstname: "Randy",
    lastname: "Savage",
    country_id: 'GB',
    street: "123 Fake St",
    city: "FakeTown",
    postcode: 'A1 1AA',
    telephone: '01234567890',
}

describe('Checkout - Critical Path - Existing Customer', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('PHPSESSID');
    });

    const username = 'registered@example.com';
    const password = 'dRYa2J3SpV0Y';

    beforeEach(() => {
            n98('db:query "delete from customer_entity"');
            n98(`customer:create ${username} ${password} A Customer 1`);
            setupCart(['radiantTeeAddToCart.json']);

            cy.request('POST', `rest/V1/integration/customer/token`, {
                "username": username,
                "password": password
            }).then((response) => {
                let token = response.body;

                cy.fixture('customerWithAddresses').then((customer) => {
                    cy.request({
                        method: 'PUT', url: 'rest/V1/customers/me', body: customer, headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                })
            });
        }
    );

    it('Checkout - New Address', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        // login
        cy.get('input[name="username"]:visible').type(username);
        cy.get('input[name="password"]:visible').type(password);
        cy.get('button[type="submit"].login').click();

        // shipping
        cy.get('.action-show-popup').click().then(() => {
            addressHandler(shippingAddress);
            // save address form
            cy.get('.action-save-address').click();
        });
        cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');
        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        // billing
        cy.contains('Payment Method');
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');
        cy.get('button.checkout[type="submit"]:visible').click();

        // success
        cy.contains('Thank you for your purchase!');
        cy.get('.content').should('not.contain', 'Create an Account');
    });

    it('Checkout - Existing Address', () => {
        cy.visit('/checkout');

        // login
        cy.get('input[name="username"]:visible').type(username);
        cy.get('input[name="password"]:visible').type(password);
        cy.get('button[type="submit"].login').click();

        // shipping
        cy.get('.action-select-shipping-item:first').click();
        cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');
        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        // billing
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');
        cy.get('button.checkout[type="submit"]:visible').click();

        // success
        cy.contains('Thank you for your purchase!');
        cy.get('.content').should('not.contain', 'Create an Account');
    });
})