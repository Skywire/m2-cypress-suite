describe('Search', () => {
    it('Search Products', () => {
        cy.visit('/');

        cy.get('#search').clear().type('Sweatshirt').type('{enter}');

        cy.get('.product-item').should('have.length.at.least', 9)
    });
})