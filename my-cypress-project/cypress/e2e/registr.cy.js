import login from '../support/helper';
import pageOrders from '../support/helper';
describe('Authentication Test', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/}, { log: false}); // В каждом тесте скрываем фоновые запросы с типами xhr и fetch 
  }); 
  it('Should login to the site', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
      auth: {
        username: 'test',
        password: 'qwe123test!'
      }
    });
    cy.contains('button span.e-buttonContent', 'Sign Up').click();
    cy.url().should('include', '/sign-up');
    cy.get('input#companyName', { timeout: 1000000 }).type('test'); //Первый ввод почему-то не принимается, подумать над этим
    cy.get('input#regEmail').type('ttttt@iiii.com');
    cy.get('input#phone').type('456789');
    cy.get('input#companyName',).type('test company');
    cy.contains('button span.e-buttonContent', 'Continue').click();
    cy.url().should('include', '/products/create');
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")').click();
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1VqIaBGGSzpqAA1RaZ_Z9OPavXgjlU9Uk4_xTbHCZCCw/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').click();
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 3000000 }).click();
  })
})
