describe.only('Checkout - Critical Path - Guest', () => {
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
    });

    it('Guest Email', () => {
        cy.visit('/checkout');
        cy.contains('Order Summary');
        cy.contains('Email Address');

        cy.get('input[name="username"]:visible').type('a@a.com');

        // cy.get('[type="submit"]').click();
        cy.screenshot();
    });
})