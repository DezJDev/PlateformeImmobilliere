/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (email, password) => {
    cy.session([email, password], () => {
        cy.visit('http://localhost:3000/login');

        cy.get('input[id="email"]').type(email);
        cy.get('input[id="password"]').type(password);
        cy.get('form').submit();

        cy.url().should('not.include', '/login');
    });
});

export { };