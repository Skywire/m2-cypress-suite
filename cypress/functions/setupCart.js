export default (fixturesToLoad = []) => {
    fixturesToLoad.forEach((filePath) => {
        cy.fixture(filePath).then((postData) => {
            cy.request({
                method: 'POST',
                url: '/checkout/cart/add',
                form: true,
                body: postData
            })
        });
    })
}