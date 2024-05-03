import login from '../support/helper';
import pageOrders from '../support/helper';
describe('Создание поставок', () => { 
  beforeEach(() => {
        login(); // Авторизация перед каждым тестом
        cy.intercept({ resourceType: /xhr|fetch/}, { log: false}); // В каждом тесте скрываем фоновые запросы с типами xhr и fetch 
      }); 
  it('Создание поставки одного товара', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 20000 }).should('be.visible').then($el => {
      const randomSupply = Math.random();
      cy.log(randomSupply);
      cy.get('.sc-a56cc42f-2').first().then(($element) => {
        cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).first().click();
        cy.get('.sc-e9dc91bf-4.goEDDY', { timeout: 10000 }).click();
        cy.get('#send-supply-invoice-number').type(randomSupply);
        cy.get('.sc-6e8302e9-10.cUoZyU', { timeout: 30000 }).click();
        cy.wait(30000); 
        // Проверяем, что инвойс создался
          });
      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/supplies`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
              }})
          .then((response) => {
            let isSupplyFound = false;
            response.body.supplies.forEach(element => {
              if (element.invoiceNumber == randomSupply){ 
                isSupplyFound = true;
                  }      
                    })
              expect(isSupplyFound).to.be.true
                });});
            });
  }); 
  it('Создание поставки из файла xlsx', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 20000 }).should('be.visible').then($el => {
      const randomSupply = Math.random();
      cy.log(randomSupply);
        cy.get('.sc-e9dc91bf-5.eiwXaX', { timeout: 10000 }).click();
        cy.get('#invoiceNumber').type(randomSupply);
        cy.get('[role="presentation"]').attachFile("567.xlsx", { subjectType: 'drag-n-drop' });
        cy.get('.sc-f44383e7-16', { timeout: 30000 }).click();
        cy.wait(30000); 
        // Проверяем, что инвойс создался

      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/supplies`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
              }})
          .then((response) => {
            let isSupplyFound = false;
            response.body.supplies.forEach(element => {
              if (element.invoiceNumber == randomSupply){ //Проверяем, что заказ действительно имеет статус confirmed
                isSupplyFound = true;
                  }      
                    })
              expect(isSupplyFound).to.be.true
                });});
            });
  }); /*
  it('Создание поставки из файла csv - баг заведен', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 20000 }).should('be.visible').then($el => {
      const randomSupply = Math.random();
      cy.log(randomSupply);
        cy.get('.sc-e9dc91bf-5.eiwXaX', { timeout: 10000 }).click();
        cy.get('#invoiceNumber').type(randomSupply);
        cy.get('[role="presentation"]').attachFile("567.csv", { subjectType: 'drag-n-drop' });
        cy.get('.sc-f44383e7-16', { timeout: 30000 }).click();
        cy.wait(30000); 
        // Проверяем, что инвойс создался

      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/supplies`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
              }})
          .then((response) => {
            let isSupplyFound = false;
            response.body.supplies.forEach(element => {
              if (element.invoiceNumber == randomSupply){ //Проверяем, что заказ действительно имеет статус confirmed
                isSupplyFound = true;
                  }      
                    })
              expect(isSupplyFound).to.be.true
                });});
            });
  }); */ 
  it('Создание поставки из файла xls ', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 20000 }).should('be.visible').then($el => {
      const randomSupply = Math.random();
      cy.log(randomSupply);
        cy.get('.sc-e9dc91bf-5.eiwXaX', { timeout: 10000 }).click();
        cy.get('#invoiceNumber').type(randomSupply);
        cy.get('[role="presentation"]').attachFile("567.xls", { subjectType: 'drag-n-drop' });
        cy.get('.sc-f44383e7-16', { timeout: 30000 }).click();
        cy.wait(30000); 
        // Проверяем, что инвойс создался

      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/supplies`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
              }})
          .then((response) => {
            let isSupplyFound = false;
            response.body.supplies.forEach(element => {
              if (element.invoiceNumber == randomSupply){ //Проверяем, что заказ действительно имеет статус confirmed
                isSupplyFound = true;
                  }      
                    })
              expect(isSupplyFound).to.be.true
                });});
            });
  }); 
  it('Создание поставки из трех заказов', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 20000 }).should('be.visible').then($el => {
      const randomSupply = Math.random();
      cy.log(randomSupply);
      cy.get('.e-checkboxCheckIcon').each(($checkbox, index) => {
        if (index < 3) {
            cy.wrap($checkbox).click();
        }
    });    
      cy.get('.sc-e9dc91bf-4.goEDDY', { timeout: 10000 }).click();
      cy.get('#send-supply-invoice-number').type(randomSupply);
      cy.get('.sc-6e8302e9-10.cUoZyU', { timeout: 30000 }).click();
      cy.wait(30000); 
        // Проверяем, что инвойс создался
      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/supplies`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
              }})
          .then((response) => {
            let isSupplyFound = false;
            response.body.supplies.forEach(element => {
              if (element.invoiceNumber == randomSupply){ //Проверяем, что заказ действительно имеет статус confirmed
                isSupplyFound = true;
                  }      
                    })
              expect(isSupplyFound).to.be.true
                });});
            });

  });  
  it('Создание поставки из файла xls ', () => {
    //Задаем рандомный номер поставки
    const randomSupply = Math.random();
    cy.log(randomSupply);
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.wait(10000);
    //Выбираем первый заказ из списка
    cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).first().click();
    //Скачиваем первый заказ
    cy.get('.e-buttonContent:contains("Export")', { timeout: 30000 }).click()
    cy.wait(10000);
    //Переносим файл из загрузок в папку fixtures
    cy.exec('mv cypress/downloads/export_orders_HJWC_confirmed.xlsx cypress/fixtures/export_orders_HJWC_confirmed.xlsx') 
      // Загружаем файл на сайт
      cy.get('.sc-e9dc91bf-5.eiwXaX').click();
      cy.get('[role="presentation"]').attachFile("export_orders_HJWC_confirmed.xlsx", { subjectType: 'drag-n-drop' });
      cy.get('#invoiceNumber').type(randomSupply);
      cy.wait(10000);
      cy.get('.sc-f44383e7-16').click();
        //Проверяем, что инвойс создался
      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/supplies`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
              }})
          .then((response) => {
            let isSupplyFound = false;
            response.body.supplies.forEach(element => {
              if (element.invoiceNumber == randomSupply){ 
                isSupplyFound = true;
                  }      
                    })
              expect(isSupplyFound).to.be.true
                });});
                //Удаляем файл по завершении теста
                cy.exec('rm cypress/fixtures/export_orders_HJWC_confirmed.xlsx');
  });
    });
