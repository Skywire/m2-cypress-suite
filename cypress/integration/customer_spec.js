import populateForm from "../functions/populateForm";
const randomEmail = require('random-email');
const username = randomEmail({domain: 'example.com'});

describe('Customer', () => {
    it('Register', () => {
        cy.visit('/customer/account/create')
        cy.contains('Create New Customer Account');

        cy.fixture('customerCreate').then((data) => {
            data['email'] = username;
            populateForm(data);
        });

        cy.get('.submit.primary').click();

        cy.contains('Account Information');
    });

    it('Login', () => {
        cy.visit('/customer/account/login')
        cy.contains('Customer Login');

        cy.fixture('customerCreate').then((data) => {
            const password = data['password'];
            cy.get('#email').clear().type(username);
            cy.get('#pass').clear().type(password);
        });

        cy.get('#send2').click();
        cy.contains('Account Information');
    });
})
