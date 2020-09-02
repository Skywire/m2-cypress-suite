const setupCart = require('../functions/checkout/setupCart');
const addressHandler = require('../functions/checkout/populateAndVerifyAddress')
const randomEmail = require('random-email');

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

    const password = 'dRYa2J3SpV0Y';
    let username = 'foo@example.com';
    let token = null;

    beforeEach(() => {
            setupCart(['radiantTeeAddToCart.json']);

            username = randomEmail({domain: 'example.com'});

            cy.fixture('customerWithAddresses').then((customer) => {
                customer.customer.email = username;

                cy.request({
                    method: 'POST', url: 'rest/V1/customers', body: customer
                }).then((response) => {
                    debugger;
                    cy.request('POST', `rest/V1/integration/customer/token`, {
                        "username": username,
                        "password": password
                    }).then(response => {
                        token = response.body;
                    })
                });
            });
        }
    );

    it.only('Existing Customer - New Address', () => {
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

        // cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');
        cy.get(':input[type="submit"]:visible').click();

        // billing
        cy.contains('Payment Method');
        // cy.get('#checkmo:visible').check();
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');
        cy.get('button.checkout[type="submit"]:visible').click();

        // success
        cy.contains('Thank you for your purchase!');
        cy.get('.content').should('not.contain', 'Create an Account');
    });

    it('Existing Customer - Existing Address', () => {
        cy.visit('/checkout');

        // login
        cy.get('input[name="username"]:visible').type(username);
        cy.get('input[name="password"]:visible').type(password);
        cy.get('button[type="submit"].login').click();

        // shipping
        cy.get('.action-select-shipping-item:first').click();
        // cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');
        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        // billing
        cy.get('#checkmo').check();
        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');
        cy.get('button.checkout[type="submit"]:visible').click();

        // success
        cy.contains('Thank you for your purchase!');
        cy.get('.content').should('not.contain', 'Create an Account');
    });
})
