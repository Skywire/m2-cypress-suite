const setupCart = require('../functions/checkout/setupCart');

describe('Cart', () => {
    beforeEach(() => {
            setupCart(['radiantTeeAddToCart']);
        }
    );

    it('View Cart', () => {
        cy.visit('/checkout/cart').contains('Proceed to Checkout');
    });
})