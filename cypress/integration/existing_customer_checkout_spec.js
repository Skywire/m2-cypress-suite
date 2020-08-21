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

describe.only('Checkout - Critical Path - Existing Customer', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('PHPSESSID');
    });

    const username = 'registered@example.com';
    const password = 'dRYa2J3SpV0Y';

    before(() => {
            n98('db:query "delete from customer_entity"');
            n98(`customer:create ${username} ${password} A Customer 1`);
            setupCart(['radiantTeeAddToCart.json']);

            cy.request('POST', `rest/V1/integration/customer/token`, {
                "username": username,
                "password": password
            }).then((response) => {
                let token = response.body;

                let customer = {
                    "customer":
                        {
                            "email": username,
                            "firstname": "A",
                            "lastname": "Shopper",
                            "storeId": 1,
                            "websiteId": 1,
                            "addresses": [
                                {
                                    "firstname": "test",
                                    "lastname": "test",
                                    "company": "test technology",
                                    "street": [
                                        "Test Street 9",
                                    ],
                                    "city": "City Nine",
                                    "region_id": 12,
                                    "region": "California",
                                    "postcode": "91790",
                                    "country_id": "US",
                                    "telephone": "1234567890"
                                },
                                {
                                    "firstname": "test",
                                    "lastname": "test",
                                    "company": "test technology",
                                    "street": [
                                        "Test Street 10",
                                    ],
                                    "city": "City Ten",
                                    "region_id": 12,
                                    "region": "California",
                                    "postcode": "91790",
                                    "country_id": "US",
                                    "telephone": "1234567890"
                                }
                            ]
                        }
                };

                cy.request({
                    method: 'PUT', url: 'rest/V1/customers/me', body: customer, headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            });
        }
    );

    it('View Cart', () => {
        cy.visit('/checkout/cart').contains('Proceed to Checkout');
    });

    it('Checkout - New Address', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        // Login
        cy.get('input[name="username"]:visible').type(username);
        cy.get('input[name="password"]:visible').type(password);
        cy.get('button[type="submit"].login').click();

        cy.get('.action-show-popup').click().then(() => {
            addressHandler(shippingAddress);
            // save address form
            cy.get('.action-save-address').click();
        });

        cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');

        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        cy.contains('Payment Method');

        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');

        cy.get('button.checkout[type="submit"]:visible').click();

        cy.contains('Thank you for your purchase!');
        cy.get('.content').should('not.contain', 'Create an Account');
    });
})