export default (command) => {
    let bin = '/usr/local/bin/n98';
    let path = Cypress.config('magePath');
    cy.exec(`${bin} --root-dir=${path} ${command}`);
}