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
    })

    before(() => {
        cy.fixture('radiantTeeAddToCart.json').then((postData) => {

            cy.request({
                method: 'POST',
                url: '/checkout/cart/add',
                form: true,
                body: postData
            })
        });
    })

    it('View Cart', () => {
        cy.visit('/checkout/cart').contains('Proceed to Checkout');
        cy.screenshot();
    });

    it('Guest Email', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        cy.get('input[name="username"]:visible').type('a@a.com');

        cy.get('.continue[type="submit"]:first').click();
    });

    it('Shipping Step', () => {

        cy.visit('/checkout#shipping');

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

        cy.screenshot();
    });
})