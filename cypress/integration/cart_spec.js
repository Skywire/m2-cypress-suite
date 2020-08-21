const setupCart = require('../functions/checkout/setupCart');

describe('Critical Path - Checkout', () => {
    beforeEach(() => {
            setupCart(['radiantTeeAddToCart']);
        }
    );

    it('View Cart', () => {
        cy.visit('/checkout/cart').contains('Proceed to Checkout');
    });
})