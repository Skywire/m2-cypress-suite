export default (shippingAddress = {}) => {
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
}