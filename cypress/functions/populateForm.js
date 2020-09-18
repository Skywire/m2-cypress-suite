export default (data = {}) => {
    Object.entries(data).forEach((keyValuePair) => {
        let [field, value] = keyValuePair;
        let selector = `:input[name^="${field}"]:visible:first`;

        cy.get(selector).clear().type(value);
        cy.get(selector).should('have.value', value);
    });
}
