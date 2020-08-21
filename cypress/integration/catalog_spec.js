describe('Critical Path - Catalog', () => {
    it('Visit a category', () => {
        cy.visit('/')

        cy.get("#ui-id-4").should('contain', 'Women').click()

        cy.contains('h1', 'Women');

        cy.get('.product-item').should('have.length.at.least', 4);
    });

    it('Add a product to the cart', () => {
        cy.server();
        cy.route('POST', '**/checkout/**').as('addToCart')

        cy.visit('/radiant-tee.html')

        cy.get('.page-title').should('contain.text', 'Radiant Tee');
        cy.get('#option-label-size-143-item-168').click()
        cy.get('#option-label-color-93-item-56').click()
        cy.get('#product-addtocart-button').click();

        cy.wait('@addToCart').then((xhr) => {
            assert.equal(xhr.status, 200);
        })
    });
})