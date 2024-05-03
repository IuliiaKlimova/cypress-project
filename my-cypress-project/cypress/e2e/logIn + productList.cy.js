describe('Авторизация и загрузка прайсов', () => {
  it('Авторизация', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
      failOnStatusCode: false // Переходит на страницу с ошибкой 401
    })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');});
  it('Загрузка прайс листа по ссылке rar', () => {
      cy.visit('https://sellerdrivetest.emexauto.com', {
        failOnStatusCode: false // Переходит на страницу с ошибкой 401
      })
      cy.contains('button span.e-buttonContent', 'Log in').click();
      cy.get('input#login').type('RUFY');
      cy.get('input#password').type('1234');
      cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
      cy.url().should('include', '/orders');
      cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
      cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
      cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
      cy.get('input#ListingName').type('Загрузка прайс листа по ссылке rar');
      cy.get('input#link').type('https://drive.google.com/file/d/15jJI0ehJR4AFn7cTD_JijWrob8bdK2hG/view?usp=drive_link');
      cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
      cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();});
  it('Загрузка прайс листа по ссылке zip', () => {
        cy.visit('https://sellerdrivetest.emexauto.com', {
          failOnStatusCode: false // Переходит на страницу с ошибкой 401
        })
        cy.contains('button span.e-buttonContent', 'Log in').click();
        cy.get('input#login').type('RUFY');
        cy.get('input#password').type('1234');
        cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
        cy.url().should('include', '/orders');
        cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
        cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
        cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
        cy.get('input#ListingName').type('Загрузка прайс листа по ссылке zip');
        cy.get('input#link').type('https://drive.google.com/file/d/1u8Y8Hy7VFcIRYinizq7rF9FE8ldHYRlk/view?usp=drive_link');
        cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
        cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();});
  it('Загрузка прайс листа по ссылке с несуществующим брендом', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
      failOnStatusCode: false // Переходит на страницу с ошибкой 401
    })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
    cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
    cy.get('input#ListingName').type('Загрузка прайс листа по ссылке с несуществующим брендом');
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1ke4vtFMrS5XFkXA8ZRr4ys6xgPzHSLCMB5P9wBUD0xk/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();});
  it('Загрузка прайс листа по ссылке без ошибок - listed', () => {
      cy.visit('https://sellerdrivetest.emexauto.com', {
      failOnStatusCode: false // Переходит на страницу с ошибкой 401
    })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
    cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
    cy.get('input#ListingName').type('Загрузка прайс листа без ошибок - listed');
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1vJcNevn_yL5KLEr-F3A8ubn_aWriI5hc6g4ucj5unDc/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();});
  it('Загрузка прайс листа по ссылке без цены', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
      failOnStatusCode: false // Переходит на страницу с ошибкой 401
    })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
    cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
    cy.get('input#ListingName').type('Загрузка прайс листа без цен');
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/17Sc2_JtjAC2z4FJnnUQDmZC2dgArrxAsdNH3yLq-coE/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();}); 
  it('Загрузка прайс листа по ссылке без ошибок - unlisted', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
    failOnStatusCode: false // Переходит на страницу с ошибкой 401
    })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
    cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
    cy.get('input#ListingName').type('Загрузка прайс листа без ошибок - unlisted');
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1vJcNevn_yL5KLEr-F3A8ubn_aWriI5hc6g4ucj5unDc/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
    cy.get('span.e-content span.e-text[data-text="Unlisted"]',{ timeout: 30000 }).scrollIntoView().should('be.visible').click();
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();}); 
  it('Загрузка прайс листа по ссылке без ошибок - on request', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
    failOnStatusCode: false // Переходит на страницу с ошибкой 401
      })
      cy.contains('button span.e-buttonContent', 'Log in').click();
      cy.get('input#login').type('RUFY');
      cy.get('input#password').type('1234');
      cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
      cy.url().should('include', '/orders');
      cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
      cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
      cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
      cy.get('input#ListingName').type('Загрузка прайс листа без ошибок - On request');
      cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1vJcNevn_yL5KLEr-F3A8ubn_aWriI5hc6g4ucj5unDc/edit#gid=0');
      cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
      cy.get('span.e-content span.e-text[data-text="On request"]',{ timeout: 30000 }).scrollIntoView().should('be.visible').click();
      cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();});  
  it('Загрузка прайс листа по ссылке без ошибок с доставкой 3 дня', () => {
    cy.visit('https://sellerdrivetest.emexauto.com', {
    failOnStatusCode: false // Переходит на страницу с ошибкой 401
     })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
    cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
    cy.get('input#ListingName').type('Загрузка прайс листа без ошибок с доставкой 3 дня');
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1vJcNevn_yL5KLEr-F3A8ubn_aWriI5hc6g4ucj5unDc/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
    cy.get('span.e-buttonContent svg.e-plus').scrollIntoView().should('be.visible').trigger('click').trigger('click');
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();}); 
  /*it('Загрузка прайс листа по ссылке без ошибок со второй строки', () => { пока не понимаю как кликнуть на вторую строку
    cy.visit('https://sellerdrivetest.emexauto.com', {
    failOnStatusCode: false // Переходит на страницу с ошибкой 401
      })
    cy.contains('button span.e-buttonContent', 'Log in').click();
    cy.get('input#login').type('RUFY');
    cy.get('input#password').type('1234');
    cy.get('button.sc-58e07bcc-4.grMaNG.e-button.e-button--sizeBig.e-button--themeOrange:contains("Sign In")').click();
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Products")').dblclick();
    cy.get('span.e-buttonContent:contains("Create listing")').should('be.visible').click();
    cy.get('.sc-270105ab-0.jyeFEL:contains("Link")', { timeout: 10000 }).should('be.visible').click();
    cy.get('input#ListingName').type('Загрузка прайс листа без ошибок со второй строки');
    cy.get('input#link').type('https://docs.google.com/spreadsheets/d/1vJcNevn_yL5KLEr-F3A8ubn_aWriI5hc6g4ucj5unDc/edit#gid=0');
    cy.get('button.sc-e8ad7e82-6.bmTufb:contains("Save")').should('be.enabled').click(); 
    cy.get('.sc-a39838f2-3 bRrAgJ.sc-101f9a90-1 la-dUlv.sc-101f9a90-0 dbJHbk e-counter.e-buttonRight e-button e-button--sizeMedium e-button--themeOrange').scrollIntoView().should('be.visible').trigger('click').trigger('click');
    cy.get('button.e-button--sizeMedium.e-button--themeOrange:contains("Start selling")',{ timeout: 30000 }).should('be.enabled').click();}); */
  })