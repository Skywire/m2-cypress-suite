const setupCart = require('./../functions/setupCart');
const addressHandler = require('../functions/populateAndVerifyShippingAddress')
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

    before(() => {
        cy.exec('/usr/local/bin/n98 --root-dir=/home/neil/development/magento24 db:query "delete from customer_entity"');
        let userCommand = `/usr/local/bin/n98 --root-dir=/home/neil/development/magento24 customer:create ${username} ${password} A Customer 1`
        cy.exec(userCommand);
        setupCart(['radiantTeeAddToCart.json']);
    });

    it('View Cart', () => {
        cy.visit('/checkout/cart').contains('Proceed to Checkout');
    });

    it('Checkout', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        cy.get('input[name="username"]:visible').type(username);
        cy.get('input[name="password"]:visible').type(password);

        cy.get('.continue[type="submit"]:first').click();

        addressHandler(shippingAddress);

        cy.get(':input[value="flatrate_flatrate"]').check().should('be.checked');

        cy.get('#shipping-method-buttons-container :input[type="submit"]').click();

        cy.contains('Payment Method');

        cy.get('#billing-address-same-as-shipping-checkmo').should('be.checked');

        cy.get('button.checkout[type="submit"]:visible').click();

        cy.contains('Thank you for your purchase!');
        cy.get('.content').should('not.contain', 'Create an Account');
    });
})