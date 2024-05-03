import login from '../support/helper';
import pageOrders from '../support/helper';
describe('Обработка заказов', () => { 
  //Продукт лист: https://docs.google.com/spreadsheets/d/1ke4vtFMrS5XFkXA8ZRr4ys6xgPzHSLCMB5P9wBUD0xk/edit#gid=0
  //Перед выполнением тестов необходимо на стенде подготовить заказы в количестве от 34шт, из которых три должны быть в кол-ве более 5шт
  //Товар 356912892 в количестве более 3х штук
  //Товар 1009797640 в количестве 1 штука
  //Товар A0008309218 количество не важно  
  //Товар 567 в количестве до 6 штук
  //Товар 1734677 в количестве от 1 штуки
  //Cтоимость товаров более 4$
  //Рекомендую перед тестом удалять подтвержденные заказы и оставлять 3 шт,тк сайпрес плохо скролит
  let username = 'HJWC';
  let password = 'pass1723'
  beforeEach(() => {
    login(); // Авторизация перед каждым тестом
    cy.intercept({ resourceType: /xhr|fetch/}, { log: false}); // В каждом тесте скрываем фоновые запросы с типами xhr и fetch 
  }); 
 it('Подтверждение заказа без изменений через окно на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.e-content:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      const count = parseInt($el.text());
      //Если заказов более 40 шт, то выполняем сценарии:
      if (count > 40) {
        cy.get('.sc-66c9d8a-1.dUQQUc.table')
        .find('.sc-91dd0ec4-0.eCjPqX:contains("A0008309218")') 
        .first() // выбираем первый элемент
        .then(($element) => {
          // Получаем order number из первого элемента и сохраняем его в переменную
          const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id');
          cy.log(`Значение элемента: ${OrderNumber}`);
          cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
          .find('.sc-66d2c0b-10').click();
          cy.get('button.e-button--sizeSmall.e-button--themeOrange').click() 
          cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
          // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
          cy.get('.sc-66c9d8a-1', { timeout: 30000 }); 
          const numericOrderNumber = OrderNumber.replace('row-', ''); 
          cy.wait(10000);
          // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
          cy.getToken().then(() => {
              cy.request({
                method: 'GET',
                url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
                headers: {
                  'Authorization': 'Bearer ' + Cypress.env('access_token'),
                  'Content-Type': 'application/json'        
                }})
                .then((response) => {
                  let isOrderFound = false;
                  response.body.orders.forEach(element => {
                    if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed"){ //Проверяем, что заказ действительно имеет статус confirmed
                      isOrderFound = true;
                    }      
                  })
                  expect(isOrderFound).to.be.true
                });});
            });}
            else {
              //Если заказов менее 40, то выводим ошибку на консоль
              cy.fail('Недостаточно заказов');
            }
          });
  }); /*
 it('Подтверждение заказа без изменений через окно на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
    cy.wait(10000); 
    cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим основной элемент
    .find('.sc-a56cc42f-2.eORhlC.table-row') // находим все элементы внутри основного элемента
    .each(($element) => { // для каждого элемента
      const OrderNumber = $element.attr('id'); // получаем значение атрибута id
      const text = $element.find('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').text(); // находим элемент с текстом "Unconfirmed" и получаем его текст
      if (text === 'Unconfirmed') { // если текст равен "Unconfirmed"
        cy.get(`#${OrderNumber}`) // находим элемент по id
        .find('.sc-66d2c0b-10').click(); // находим первый элемент с классом 'sc-66d2c0b-10'
        cy.get('span.sc-a2f8a5ae-13.kANYxk').contains('Confirm').click();
        const numericOrderNumber = OrderNumber.replace('row-', '');
        cy.log(numericOrderNumber);
        cy.wait(10000); 
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); 
        cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
          cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'
              }})
              .then((response) => {
                let isOrderFound = false;
                response.body.orders.forEach(element => {
                  if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed"){ //Проверяем, что заказ действительно имеет статус confirmed
                    isOrderFound = true;
                  }      
                })
                expect(isOrderFound).to.be.true
                
              });
            });
            return false;} // выходим из цикла, после успешного выполнения теста с одной строкой
          });
  });  
  it('Подтверждение заказа без изменений через окно на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      const count = parseInt($el.text());
    //Если заказов более 10 шт, то выполняем сценарии:
      if (count > 10) {
        cy.get('.sc-a56cc42f-2').first()
        .should('be.visible').then(($element) => {// Получаем order number элемента c K16RU и сохраняем его в переменную
        const OrderNumber = $element.prop('id').replace('row-', ''); 
          cy.log(`Значение элемента: ${OrderNumber}`);
        cy.get('.sc-66d2c0b-10').first().click();
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click() 
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', OrderNumber); 
               cy.get(`[id^="row-${OrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
    // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
    //Получаем токен авторизации и сохраняем его 
    cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
          }
        }).then((response) => {  
          let isOrderFound = false;
          response.body.orders.forEach(element => {
            if (element.orderDetailSubId == OrderNumber && element.status == "confirmed"){ //Проверяем, что заказ действительно имеет статус confirmed
              isOrderFound = true;
            }      
          })
          expect(isOrderFound).to.be.true
        });  
  });
       });
      } else {
        //Если заказов менее 10, то выводим ошибку на консоль
        cy.fail('Недостаточно заказов');
      } 
    });
  }); 
  it('Подтверждение заказа с меньшей суммой через окно на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-a56cc42f-2').first().then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.attr('id');
        cy.log(`Значение элемента: ${OrderNumber}`);
        cy.get(`#${OrderNumber}`) // находим элемент по id
        .find('.sc-66d2c0b-10').click(); // находим первый элемент с классом 'sc-66d2c0b-10'
        cy.get('input[name="price"]').clear() // Очищаем текущее значение в поле ввода
        .type('3'); //Вводим стоимость - 3
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000)
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();// Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
        cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
          cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {            
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.price.value == 3.00){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      });
    });
  }); 
  it('Подтверждение заказа с меньшей суммой через окно на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-a56cc42f-2').first().then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.attr('id');
        cy.log(`Значение элемента: ${OrderNumber}`);
        cy.get(`#${OrderNumber}`) // находим элемент по id
        .find('.sc-66d2c0b-10').click(); // находим первый элемент с классом 'sc-66d2c0b-10'
        cy.get('input[name="price"]').clear() // Очищаем текущее значение в поле ввода
        .type('3'); //Вводим стоимость - 3
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
        cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); 
          cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {            
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.price.value == 3.00){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      });
    });
  }); 
  it('Подтверждение заказа с меньшей суммой через окно на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
    cy.wait(10000); 
    cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим основной элемент
    .find('.sc-a56cc42f-2.eORhlC.table-row') // находим все элементы внутри основного элемента
    .each(($element) => { // для каждого элемента
      const OrderNumber = $element.attr('id'); // получаем значение атрибута id
      const text = $element.find('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').text(); // находим элемент с текстом "Unconfirmed" и получаем его текст
      if (text === 'Unconfirmed') { // если текст равен "Unconfirmed"
        cy.get(`#${OrderNumber}`) // находим элемент по id
        .find('.sc-66d2c0b-10').click(); // находим первый элемент с классом 'sc-66d2c0b-10'
        cy.get('input[name="price"]').clear() // Очищаем текущее значение в поле ввода
      .type('3'); //Вводим стоимость - 3
        cy.get('span.sc-a2f8a5ae-13.kANYxk').contains('Confirm').click();
        const numericOrderNumber = OrderNumber.replace('row-', '');
        cy.log(numericOrderNumber);
        cy.wait(10000); 
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); 
        cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'
              }})
              .then((response) => {
                let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.price.value == 3.00){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
              });
            });
            return false;} // выходим из цикла, после успешного выполнения теста с одной строкой
          });
  });
  it('Подтверждение заказа с меньшим колличеством и ценой через окно на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
      .find('.sc-91dd0ec4-0.eCjPqX')
      .contains('div', '567')
      .then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
        cy.get('input[name="quantity"]').clear() // Очищаем текущее значение в поле ввода
        .type('5'); //Вводим количество - 5
        cy.get('input[name="price"]').clear() // Очищаем текущее значение в поле ввода
        .type('7'); //Вводим стоимость - 7
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000)
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();// Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
        cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
          cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {            
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 5){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      });
    });
  });  
  it('Подтверждение заказа с меньшим колличеством и ценой через окно на вкладке Confirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
      .find('.sc-91dd0ec4-0.jWlXdf')
      .contains('div', '567')
      .then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
        cy.get('input[name="quantity"]').clear() // Очищаем текущее значение в поле ввода
        .type('1'); //Вводим количество - 1
        cy.get('input[name="price"]').clear() // Очищаем текущее значение в поле ввода
        .type('3'); //Вводим стоимость - 3
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000)
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();// Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {            
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 1){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      });
    });
  }); 
  it('Подтверждение заказа с меньшим колличеством и ценой через окно на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
      .find('.sc-91dd0ec4-0.eCjPqX')
      .contains('div', '567')
      .then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
        cy.get('input[name="quantity"]').clear() // Очищаем текущее значение в поле ввода
        .type('8'); //Вводим количество - 8
        cy.get('input[name="price"]').clear() // Очищаем текущее значение в поле ввода
        .type('6'); //Вводим стоимость - 6
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000)
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();// Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
          cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {            
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 8){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      });
    });
  });  
  it('Подтверждение заказа с заменой substitution part number через окно на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.wait(10000);
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
    .find('.sc-91dd0ec4-0.eCjPqX')
    .contains('div', 'A0008309218')
    .should('be.visible')
    .then(($element) => {
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
        cy.get('input[name="substitutionPartNumber"]') // Очищаем текущее значение в поле ввода
        .type('1568269'); //Вводим деталь замены 1568269
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
       // cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {    
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.detailNum == "1568269"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      })
    });
  }); 
  it('Подтверждение заказа с заменой substitution part number через окно на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.wait(10000);
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
    .find('.sc-91dd0ec4-0.jWlXdf:contains("1009797640")') 
    .should('be.visible')
    .then(($element) => {
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
        cy.get('input[name="substitutionPartNumber"]') // Очищаем текущее значение в поле ввода
        .type('1987432150'); //Вводим деталь замены 1568269
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
       // cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {    
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.detailNum == "1987432150"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      })
    });
  }); */
  it('Подтверждение заказа с заменой substitution part number через окно на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.wait(10000);
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
    .find('.sc-91dd0ec4-0.jWlXdf:contains("000000712P")') 
    .should('be.visible')
    .then(($element) => {
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
        cy.get('input[name="substitutionPartNumber"]') // Очищаем текущее значение в поле ввода
        .type('1987432150'); //Вводим деталь замены 1987432150
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
       // cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {    
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.detailNum == "1987432150"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      })
    });
  }); /*
  it('Подтверждение заказа с заменой substitution brand и part number через окно на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.wait(10000);
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
      .find('.sc-91dd0ec4-0.eCjPqX:contains("1734677")') 
    .then(($element) => {
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
      cy.get('.select__input-container.css-19bb58m') .type('BMW', { delay: 200 });
      cy.get('.sc-f18cd15b-0.bLEvbo').first().click();  //В выпадающем списке брендов выбираем первый бренд BMW
      cy.get('input[name="substitutionPartNumber"]') // Очищаем текущее значение в поле ввода
        .type('1568269'); //Вводим деталь замены 1568269
        cy.wait(1000);
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
       // cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {    
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.detailNum == "1568269" && element.makeName == "BMW"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      })
    });
  }); 
  it('Подтверждение заказа с заменой substitution brand и part number через окно на вкладке Confirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.wait(10000);
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
      .find('.sc-91dd0ec4-0.jWlXdf:contains("A0008309218")') 
    .then(($element) => {
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
      cy.get('.select__input-container.css-19bb58m') .type('Audi', { delay: 200 });
      cy.get('.sc-f18cd15b-0.bLEvbo').first().click();  //В выпадающем списке брендов выбираем первый бренд Audi
      cy.get('input[name="substitutionPartNumber"]') // Очищаем текущее значение в поле ввода
        .type('1568269'); //Вводим деталь замены 1568269
        cy.wait(1000);
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
       // cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {    
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.detailNum == "1568269" && element.makeName == "Audi"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      })
    });
  }); 
  it('Подтверждение заказа с заменой substitution brand и part number через окно на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.wait(10000);
      cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
      .find('.sc-91dd0ec4-0.eCjPqX:contains("1734677")') 
    .then(($element) => {
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
      cy.get('.select__input-container.css-19bb58m') .type('BMW', { delay: 200 });
      cy.get('.sc-f18cd15b-0.bLEvbo').first().click();  //В выпадающем списке брендов выбираем первый бренд BMW
      cy.get('input[name="substitutionPartNumber"]') // Очищаем текущее значение в поле ввода
        .type('1568269'); //Вводим деталь замены 1568269
        cy.wait(1000);
        cy.get('button.e-button--sizeSmall.e-button--themeOrange').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        const numericOrderNumber = OrderNumber.replace('row-', '');
       // cy.get('.sc-66c9d8a-1.dUQQUc', { timeout: 30000 }).should('contain', numericOrderNumber); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }
          }).then((response) => {    
            let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.detailNum == "1568269" && element.makeName == "BMW"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
          });  
        });
      })
    });
  }); 
  it('Подтверждение одного заказа через чекбокс на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
cy.wait(20000); 
cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим основной элемент
.find('.sc-a56cc42f-2.eORhlC.table-row') // находим все элементы внутри основного элемента
.each(($element) => { // для каждого элемента
const OrderNumber = $element.attr('id'); // получаем значение атрибута id
const text = $element.find('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').text(); // находим элемент с текстом "Unconfirmed" и получаем его текст
if (text === 'Unconfirmed') { // если текст равен "Unconfirmed"
  cy.get(`#${OrderNumber}`) // находим элемент по id
    .find('.e-checkboxCheckIcon').click(); // находим чекбокс выбранного элемента
    cy.get('.sc-e9dc91bf-2.hyxnDI.e-button.e-button--sizeMedium.e-button--themeWhite:contains("Confirm")', { timeout: 10000 }).click();
    const numericOrderNumber = OrderNumber.replace('row-', '');
    cy.log(numericOrderNumber);
    cy.wait(20000); 
    cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
      cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
    cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); 
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
    cy.request({
      method: 'GET',
      url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
      headers: {
        'Authorization': 'Bearer ' + Cypress.env('access_token'),
        'Content-Type': 'application/json'        
      }
    }).then((response) => {
      let isOrderFound = false;
      response.body.orders.forEach(element => {
        if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed"){ //Проверяем, что заказ действительно имеет статус confirmed
          isOrderFound = true;
        }      
      })
      expect(isOrderFound).to.be.true
     });
   });
return false; // выходим из цикла, после успешного выполнения теста с одной строкой
}
});
  }); 
  it('Подтверждение одного заказа через чекбокс на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      const count = parseInt($el.text());
        cy.get('.sc-a56cc42f-2').first().then(($element) => {
          // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.prop('id').replace('row-', ''); 
          cy.log(`Значение элемента: ${OrderNumber}`);
        cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).first().click();
        cy.get('.sc-e9dc91bf-2.hyxnDI.e-button.e-button--sizeMedium.e-button--themeWhite:contains("Confirm")', { timeout: 10000 }).click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        cy.wait(10000);
        cy.get(`[id^="row-${OrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
          cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }
            }).then((response) => {
              let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == OrderNumber && element.status == "confirmed"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
            });  
      });
       }); 
    });

  }); 
  it('Подтверждеие одного заказа через чекбокс на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      const count = parseInt($el.text());
        cy.get('.sc-a56cc42f-2').first().then(($element) => {
          // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.prop('id').replace('row-', ''); 
          cy.log(`Значение элемента: ${OrderNumber}`);
        cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).first().click();
        cy.get('.sc-e9dc91bf-2.hyxnDI.e-button.e-button--sizeMedium.e-button--themeWhite:contains("Confirm")', { timeout: 10000 }).click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
        cy.get(`[id^="row-${OrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
          cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          });   
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ
        cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }
            }).then((response) => {
              let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == OrderNumber && element.status == "confirmed" ){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
            });  
      });
       }); 
    });

  });  
  it('Подтверждение пяти заказов через чекбокс на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.wait(10000); 
    // Задаем переменную со списком заказов, которые будем подтверждать
    let OrderNumber = [];
// Получаем список партномеров, добавляем их в массив переменной OrderNumber и включаем у них чекбоксы
cy.get('.sc-66c9d8a-1.dUQQUc.table').within(() => {
  cy.get('.sc-a56cc42f-2.eORhlC.table-row').then(($elements) => {
    for (let i = 0; i < 5; i++) {
      if ($elements[i] && $elements[i].id) {
        const idWithoutPrefix = $elements[i].id.replace('row-', '');
        OrderNumber.push(idWithoutPrefix);
        cy.wrap($elements[i]).find('.e-checkboxInput').check({ force: true });
      }
    }
    //Проверяем, что в массиве 5 значений
    expect(OrderNumber.length).to.equal(5);
  });
}).then(() => {
  cy.log(OrderNumber.toString());
  cy.get('.sc-e9dc91bf-2.hyxnDI.e-button.e-button--sizeMedium.e-button--themeWhite:contains("Confirm")').click();
    cy.wait(10000);
    cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click().then(() => { 
      // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - пока не могу обойти историю поиска, когда на странице очень много заказов,
      // при наличии небольшого кол-ва код работает
    //  cy.scrollTo('bottom');
      //    cy.wait(10000);
      //    cy.get('.sc-66c9d8a-1').should('contain', OrderNumber[0])
      //    .and('contain', OrderNumber[1])
      //    .and('contain', OrderNumber[2])
      //    .and('contain', OrderNumber[3])
      //    .and('contain', OrderNumber[4]);
       
});
// Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
    //Получаем токен авторизации и сохраняем его 
    cy.getToken().then(() => {
      OrderNumber.forEach((OrderNumber) => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
          }
        }).then((response) => {
          let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == OrderNumber && element.status == "confirmed" ){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
        }); }); 
  });
});
  });  
  it('Подтверждение пяти заказов через чекбокс на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
    cy.wait(10000); 

const OrderNumber = [];

cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим основной элемент
    .find('.sc-a56cc42f-2.eORhlC.table-row') // находим все элементы внутри основного элемента
    .each(($element, index) => { // для каждого элемента
        const id = $element.attr('id'); // получаем значение атрибута id
        const trimmedId = id.replace('row-', '');
        const text = $element.find('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').text(); // находим элемент с текстом "Unconfirmed" и получаем его текст
        if (text === 'Unconfirmed' && OrderNumber.length < 5) { // если текст равен "Unconfirmed" и количество элементов в массиве меньше 5
            OrderNumber.push(trimmedId); // добавляем id в массив OrderNumber
            cy.get(`#${id}`) // находим элемент по id
                .find('.e-checkboxCheckIcon').click(); // кликаем на чекбокс
                cy.log(JSON.stringify(OrderNumber));// выводим массив в логи
                
        } 
    }).then(() => { 

      cy.get('.sc-e9dc91bf-2.hyxnDI.e-button.e-button--sizeMedium.e-button--themeWhite:contains("Confirm")').click();
        cy.wait(10000);
        cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click().then(() => { 
cy.getToken().then(() => {
      OrderNumber.forEach((OrderNumber) => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
          }
        }).then((response) => {
          let isOrderFound = false;
          response.body.orders.forEach(element => {
            if (element.orderDetailSubId == OrderNumber && element.status == "confirmed" ){ //Проверяем, что заказ действительно имеет статус confirmed
              isOrderFound = true;
            }      
          })
          expect(isOrderFound).to.be.true
        }); }); });});
  });
  }); 
  it('Подтверждение пяти заказов через чекбокс на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.wait(10000); 
    // Задаем переменную со списком заказов, которые будем подтверждать
    let OrderNumber = [];
// Получаем список партномеров, добавляем их в массив переменной OrderNumber и включаем у них чекбоксы
cy.get('.sc-66c9d8a-1.dUQQUc.table').within(() => {
  cy.get('.sc-a56cc42f-2.eORhlC.table-row').then(($elements) => {
    for (let i = 0; i < 5; i++) {
      if ($elements[i] && $elements[i].id) {
        const idWithoutPrefix = $elements[i].id.replace('row-', '');
        OrderNumber.push(idWithoutPrefix);
        cy.wrap($elements[i]).find('.e-checkboxInput').check({ force: true });
      }
    }
    //Проверяем, что в массиве 5 значений
    expect(OrderNumber.length).to.equal(5);
  });
}).then(() => {
  cy.log(OrderNumber.toString());
  cy.get('.sc-e9dc91bf-2.hyxnDI.e-button.e-button--sizeMedium.e-button--themeWhite:contains("Confirm")').click();
    cy.wait(10000);
    cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click().then(() => { 
      // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - пока не могу обойти историю поиска, когда на странице очень много заказов,
      // при наличии небольшого кол-ва код работает
    //  cy.scrollTo('bottom');
      //    cy.wait(10000);
      //    cy.get('.sc-66c9d8a-1').should('contain', OrderNumber[0])
      //    .and('contain', OrderNumber[1])
      //    .and('contain', OrderNumber[2])
      //    .and('contain', OrderNumber[3])
      //    .and('contain', OrderNumber[4]);
       
});
// Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
cy.getToken().then(() => {
      OrderNumber.forEach((OrderNumber) => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
          }
        }).then((response) => {
          let isOrderFound = false;
          response.body.orders.forEach(element => {
            if (element.orderDetailSubId == OrderNumber && element.status == "confirmed" ){ //Проверяем, что заказ действительно имеет статус confirmed
              isOrderFound = true;
            }      
          })
          expect(isOrderFound).to.be.true
        }); }); 
  });
});
  });  
  it('Подтверждение части заказа (3штуки от 4х) через окно на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.wait(10000);
    cy.get('.sc-66c9d8a-1.dUQQUc.table') // находим список заказов
    .find('.sc-91dd0ec4-0.eiGHkL') // находим все элементы с указанным класом (это цена и количество)
    .each(($element, index) => { 
      if (index % 2 !== 0) { // фильтруем только каждый второй элемент (отбрасываем цены)
        const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); 
        const value = $element.text().trim();
        if (value <= 4) { // проверяем, что количество более 4х
        return; // если значение не соответствует условию, запускаем для следующего элемента
      }
      // Дальнейшая обработка элемента
      cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // кликаем на карандаш у найденного элемента
      cy.get('input[name="quantity"]').clear() // Очищаем текущее значение в поле ввода
      .type('3');
      cy.get('span.sc-a2f8a5ae-13.kANYxk').contains('Confirm').click();
      const numericOrderNumber = OrderNumber.replace('row-', '');
      cy.log(numericOrderNumber);
      cy.wait(10000);
      cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
      cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); 
      cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
        cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
        });   
        cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }})
            .then((response) => {
              let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 3){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
            });
          });
          return false;} // выходим из цикла, после успешного выполнения теста с одной строкой
        });
  }); */
  it('Подтверждение части заказа (3штуки от 4х) через окно на вкладке All', () => {
  cy.url().should('include', '/orders');
  cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
  cy.get('.e-sortButton.e-button.e-button--sizeMedium.e-button--themeTransparent:contains("All")', { timeout: 30000 }).click();
  cy.wait(10000);
  cy.get('.sc-66c9d8a-1.dUQQUc.table .sc-a56cc42f-2.eORhlC.table-row').each(($row, index) => { 
    if (index % 2 === 1) { // Рассматриваем каждый второй элемент
      const status = $row.find('.sc-66d2c0b-1.bdIKVY span').text().trim(); 
      if (status === 'Unconfirmed'){  // Проверяем статус "Unconfirmed"
        const quantityElement = $row.find('.sc-91dd0ec4-0.eiGHkL').eq(1); // Получаем второй элемент второго вида
        const quantity = parseInt(quantityElement.text().trim());
        if (quantity > 4) { // Проверяем количество более 4
          const OrderNumber = $row.attr('id').replace('row-', ''); 
          cy.get(`[id^='row-${OrderNumber}'] .sc-66d2c0b-10`, { timeout: 10000 }).should('be.visible').click(); // Кликаем на карандаш 
          cy.get('input[name="quantity"]').clear().type('3'); // Вводим количество 3
          cy.get('span.sc-a2f8a5ae-13.kANYxk').contains('Confirm').click(); // Нажимаем Confirm
          const numericOrderNumber = OrderNumber.replace('row-', '');
          cy.log(numericOrderNumber);
          cy.wait(10000); // Ждем окончания операции
          cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click(); // Подтверждаем статус
          cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); // Проверяем новый статус
 
          //Получаем токен авторизации и сохраняем его 
          cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
              headers: {      
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }}).then((response) => {
                let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 3){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
              });
            });
            return false; // выходим из цикла, после успешного выполнения теста с одной строкой
          }}} 
        });
  }); /*
  it('Подтверждение части заказа (3штуки от 4х) через окно на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0.jRfRMX:contains("Confirmed")', { timeout: 30000 }).click();
    cy.wait(10000);
    cy.get('.sc-66c9d8a-1.dUQQUc.table .sc-a56cc42f-2.eORhlC .sc-91dd0ec4-0.jYsXDz').each(($row, index) => { 
      if (index % 2 === 1) { // Рассматриваем каждый второй элемент
        const OrderNumber = $row.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id');
        const value = parseInt($row.text().trim());
          if (value <= 4) { // Проверяем количество более 4
            return};
            cy.get(`#${OrderNumber}`) // Получаем id найденного элемента
      .find('.sc-66d2c0b-10').click(); // Кликаем на карандаш 
            cy.get('input[name="quantity"]').clear().type('3'); // Вводим количество 3
            cy.get('span.sc-a2f8a5ae-13.kANYxk').contains('Confirm').click(); // Нажимаем Confirm
            const numericOrderNumber = OrderNumber.replace('row-', '');
            cy.log(numericOrderNumber);
            cy.wait(10000); // Ждем окончания операции
            cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click(); // Подтверждаем статус
            cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); // Проверяем новый статус
            cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
              cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
            });   
            //Получаем токен авторизации и сохраняем его 
            cy.getToken().then(() => {
              cy.request({
                method: 'GET',
                url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
                headers: {      
                  'Authorization': 'Bearer ' + Cypress.env('access_token'),
                  'Content-Type': 'application/json'        
                }}).then((response) => {
                  let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 3){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true; //тут чет не работает
              }      
            })
            expect(isOrderFound).to.be.true
                });
              });
              return false; // выходим из цикла, после успешного выполнения теста с одной строкой
            }} 
          );
  }); 
  it('Подтверждение заказа через импорт с равным количеством - первый из списка по номеру детали на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click(); //переходим на вкладку Unconfirmed
    cy.get('.sc-91dd0ec4-0.eCjPqX:contains("1009797640")') // находим все элементы с указанным парт номером и берем первый
    .first()
    .then(($element) => {      
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); //сохраняем значение номера заказа в переменную
      cy.log(`Значение элемента: ${OrderNumber}`);
      const numericOrderNumber = OrderNumber.replace('row-', '');
      cy.get('.sc-8337877d-11:contains("Import")', { timeout: 30000 }).click(); //загружаем файл через импорт
      cy.get('[role="presentation"]').attachFile("1009797640.xlsx", { subjectType: 'drag-n-drop' });
      cy.wait(30000); //добавили ожидание после загрузки и после клика на добавление файла
      cy.get('.sc-2a4ff261-15',).click();
      cy.wait(20000);
      cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click(); //переходим на страницу Confirmed
      cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); //проверяем наличие OrderNumber в подтвержденных 
      cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => {
        cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
      });         
      cy.getToken().then(() => {
          cy.request({
            method: 'GET',
            url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
            headers: {
              'Authorization': 'Bearer ' + Cypress.env('access_token'),
              'Content-Type': 'application/json'        
            }})
            .then((response) => {
              let isOrderFound = false;
            response.body.orders.forEach(element => {
              if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed"){ //Проверяем, что заказ действительно имеет статус confirmed
                isOrderFound = true;
              }      
            })
            expect(isOrderFound).to.be.true
          });
        });
      });
  });
  it('Подтверждение заказа через импорт с меньшим количеством - первый из списка по номеру детали на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click(); //переходим на вкладку Unconfirmed
    cy.get('.sc-91dd0ec4-0.eCjPqX:contains("356912892")', { timeout: 30000 }) // находим все элементы с указанным парт номером и берем первый
    .first()
    .then(($element) => {      
      const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id'); //сохраняем значение номера заказа в переменную
      cy.log(`Значение элемента: ${OrderNumber}`);
      const numericOrderNumber = OrderNumber.replace('row-', '');
      cy.get('.sc-8337877d-11:contains("Import")', { timeout: 30000 }).click(); //загружаем файл через импорт
      cy.get('[role="presentation"]').attachFile("356912892.xlsx", { subjectType: 'drag-n-drop' });
      cy.wait(30000); //добавили ожидание после загрузки и после клика на добавление файла
      cy.get('.sc-2a4ff261-15',).click();
      cy.wait(30000);
      cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click(); //переходим на страницу Confirmed
      cy.get('.sc-66c9d8a-1', { timeout: 30000 }).should('contain', numericOrderNumber); //проверяем наличие OrderNumber в подтвержденных 
      cy.get(`[id^="row-${numericOrderNumber}"]`).within(() => {
        cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
        cy.get('.sc-91dd0ec4-0.jYsXDz').eq(1).should('contain', '2');
      });         
      cy.getToken().then(() => {
        cy.request({
          method: 'GET',
          url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
          headers: {
            'Authorization': 'Bearer ' + Cypress.env('access_token'),
            'Content-Type': 'application/json'        
          }})
      .then((response) => {
        let isOrderFound = false;
        response.body.orders.forEach(element => {
          if (element.orderDetailSubId == numericOrderNumber && element.status == "confirmed" && element.quantity == 2){ //Проверяем, что заказ действительно имеет статус confirmed
            isOrderFound = true;
          }      
        })
        expect(isOrderFound).to.be.true
      });
    });
  });
  }); 
  /* Тест пока не работает, надо подумать как проверять два заказа
  it('Подтверждение заказа через импорт с большим количеством - первый из списка по номеру детали на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.get('span.sc-c6bc0d21-7.gxQwIb:contains("Orders")').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click(); //переходим на вкладку Unconfirmed
    let OrderNumbers = [];
    let numericOrderNumber;
    cy.get('.sc-91dd0ec4-0.eCjPqX:contains("567")', { timeout: 30000 })
    .each(($element, index) => {
      if (index < 2) {
        const OrderNumber = $element.closest('.sc-a56cc42f-2.eORhlC.table-row').attr('id');
        OrderNumbers.push(OrderNumber);
      }
    })
    .then(() => {
      numericOrderNumber = OrderNumbers.map(orderNumber => orderNumber.replace('row-', ''));
      cy.log(`Order Numbers: ${OrderNumbers}`);
      cy.log(`Numeric Order Numbers: ${numericOrderNumber}`);
      cy.get('.sc-8337877d-11:contains("Import")', { timeout: 30000 }).click(); //загружаем файл через импорт
      cy.get('[role="presentation"]').attachFile("567.xlsx", { subjectType: 'drag-n-drop' });
      cy.wait(30000); //добавили ожидание после загрузки и после клика на добавление файла
      cy.get('.sc-2a4ff261-15',).click();
      cy.wait(30000);
      cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click(); //переходим на страницу Confirmed
      for (let i = 0; i < numericOrderNumber.length; i++) {
        const currentNumericOrderNumber = numericOrderNumber[i];
        cy.get(`[id^="row-${currentNumericOrderNumber}"]`).within(() => {
          cy.get('.sc-72ca692b-0.sc-66d2c0b-2.eCMgsa.eDCiCK').should('contain', 'Confirmed');
          cy.get('.sc-91dd0ec4-0.jYsXDz').eq(1).should('contain', '4');
          cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=Confirmed`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'
              }})
            .then((response) => {
              let isOrderFound = false;
              response.body.orders.forEach(element => {
                if (element.orderDetailSubId == currentNumericOrderNumber && element.status == "confirmed" && element.quantity == 8){ //Проверяем, что заказ действительно имеет статус confirmed
                  isOrderFound = true;
                }      
              })
              expect(isOrderFound).to.be.true
            });
          });
      });
    }}); 
  }); */  /*
  it('Удаление одного заказа через корзину на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick(); //Переходим на страницу заказов
    cy.get('.e-content:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
        cy.get('.sc-a56cc42f-2').first().then(($element) => {
          // Получаем order number из первого элемента и сохраняем его в переменную
          const OrderNumber = $element.prop('id').replace('row-', ''); 
          cy.log(`Значение элемента: ${OrderNumber}`);//Выводим на консоль order nuber первого заказа
          cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).first().click(); // Кликаем на его чекбокс
          cy.get('.sc-e9dc91bf-10').first().click(); //кликаем на корзину
          // Проверяем, что выбранный заказ удален
          cy.wait(10000);
          cy.get(`[id^="row-${OrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-6f8fa4cf-0').first().should('contain', 'canceled after');
          });   
          // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
          cy.wait(30000); //ждем 30с, чтобы заказ удалился
          cy.getToken().then(() => {
              cy.request({
                method: 'GET',
                url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=All`,
                headers: {
                  'Authorization': 'Bearer ' + Cypress.env('access_token'),
                  'Content-Type': 'application/json'        
                }})
                .then((response) => {
                  expect(JSON.stringify(response.body)).to.not.include(OrderNumber); //Проверяем, что тестируемого заказа нет среди всех заказов
                });
              });
            });
          });
  }); 
  it('Удаление одного заказа через корзину на вкладке Сonfirmed', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick(); //Переходим на страницу заказов
    cy.get('.e-content:contains("Confirmed")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
        cy.get('.sc-a56cc42f-2').first().then(($element) => {
          // Получаем order number из первого элемента и сохраняем его в переменную
          const OrderNumber = $element.prop('id').replace('row-', ''); 
          cy.log(`Значение элемента: ${OrderNumber}`);//Выводим на консоль order nuber первого заказа
          cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).first().click(); // Кликаем на его чекбокс
          cy.get('.sc-e9dc91bf-10').first().click(); //кликаем на корзину
          // Проверяем, что выбранный заказ удален
          cy.wait(10000);
          cy.get(`[id^="row-${OrderNumber}"]`).within(() => { //Проверяем, что тестируемый заказ имеет статус Confirmed
            cy.get('.sc-6f8fa4cf-0').first().should('contain', 'canceled after');
          });   
          // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
          cy.wait(30000); //ждем 30с, чтобы заказ удалился
          cy.getToken().then(() => {
              cy.request({
                method: 'GET',
                url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=All`,
                headers: {
                  'Authorization': 'Bearer ' + Cypress.env('access_token'),
                  'Content-Type': 'application/json'        
                }})
                .then((response) => {
                  expect(JSON.stringify(response.body)).to.not.include(OrderNumber); //Проверяем, что тестируемого заказа нет среди всех заказов
                });
              });
            });
          });
  }); 
  it('Удаление одного заказа в стаусе Unconfirmed через корзину на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick(); //Переходим на страницу заказов
    cy.get(':nth-child(1) > .e-buttonContent > .e-content')
    cy.get('.e-content:contains("All")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-a56cc42f-2:contains("Unconfirmed")').first().then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.prop('id').replace('row-', ''); 
        cy.log(`Значение элемента: ${OrderNumber}`);//Выводим на консоль order nuber первого заказа
        // Проверяем, что выбранный заказ удален
        cy.get(`[id^="row-${OrderNumber}"]`).within(() => { 
          cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).click();}); // Кликаем на его чекбокс
        cy.get('.sc-e9dc91bf-10').first().click(); //кликаем на корзину
        cy.wait(10000);
        cy.get('.sc-6f8fa4cf-0').first().should('contain', 'canceled after'); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        cy.wait(30000); //ждем 30с, чтобы заказ удалился
        cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=All`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }})
              .then((response) => {
                expect(JSON.stringify(response.body)).to.not.include(OrderNumber); //Проверяем, что тестируемого заказа нет среди всех заказов
              });
            });
          });
        });
  }); 
  it('Удаление одного заказа в стаусе confirmed через корзину на вкладке All', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick(); //Переходим на страницу заказов
    cy.get(':nth-child(1) > .e-buttonContent > .e-content')
    cy.get('.e-content:contains("All")', { timeout: 30000 }).click();
    cy.get('.sc-8a48a8b2-2', { timeout: 10000 }).should('be.visible').then($el => {
      cy.get('.sc-a56cc42f-2:contains("Confirmed")').first().then(($element) => {
        // Получаем order number из первого элемента и сохраняем его в переменную
        const OrderNumber = $element.prop('id').replace('row-', ''); 
        cy.log(`Значение элемента: ${OrderNumber}`);//Выводим на консоль order nuber первого заказа
        // Проверяем, что выбранный заказ удален
        cy.get(`[id^="row-${OrderNumber}"]`).within(() => { 
          cy.get('.e-checkboxCheckIcon', { timeout: 10000 }).click();}); // Кликаем на его чекбокс
        cy.get('.sc-e9dc91bf-10').first().click(); //кликаем на корзину
        cy.wait(10000);
        cy.get('.sc-6f8fa4cf-0').first().should('contain', 'canceled after'); 
        // Проверяем, что в списке подтвержденных есть наш подтвержденный заказ - через вызов api/v1/orders?state=Confirmed
        cy.wait(30000); //ждем 30с, чтобы заказ удалился
        cy.getToken().then(() => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=All`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }})
              .then((response) => {
                expect(JSON.stringify(response.body)).to.not.include(OrderNumber); //Проверяем, что тестируемого заказа нет среди всех заказов
              });
            });
          });
        });
  }); 
  it('Удаление трех заказов через чекбокс на вкладке Unconfirmed', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Unconfirmed")', { timeout: 30000 }).click();
    cy.wait(10000); 
    // Задаем переменную со списком заказов, которые будем подтверждать
    let OrderNumber = [];
    // Получаем список партномеров, добавляем их в массив переменной OrderNumber и включаем у них чекбоксы
    cy.get('.sc-66c9d8a-1.dUQQUc.table').within(() => {
      cy.get('.sc-a56cc42f-2.eORhlC.table-row').then(($elements) => {
        for (let i = 0; i < 3; i++) {
          if ($elements[i] && $elements[i].id) {
            const idWithoutPrefix = $elements[i].id.replace('row-', '');
            OrderNumber.push(idWithoutPrefix);
            cy.wrap($elements[i]).find('.e-checkboxInput').check({ force: true });
          }}
          //Проверяем, что в массиве 3 значения
          expect(OrderNumber.length).to.equal(3);
        });
      }).then(() => {
        cy.log(OrderNumber.toString());
        cy.get('.sc-e9dc91bf-10').first().click();
        cy.wait(10000);
        // Проверяем, что в списке подтвержденных нет наших удаленныз заказов - через вызов api/v1/orders?state=All
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          OrderNumber.forEach((OrderNumber) => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=All`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }
            }).then((response) => {
              expect(JSON.stringify(response.body)).to.not.include(OrderNumber);
            });
          }); 
        });
      });
  });  
  it('Удаление трех заказов через чекбокс на вкладке Confirmed', () => {
    cy.url().should('include', '/orders');
    cy.xpath('//span[text()="Orders"]').dblclick();
    cy.get('.sc-8a48a8b2-0:contains("Confirmed")', { timeout: 30000 }).click();
    cy.wait(10000); 
    // Задаем переменную со списком заказов, которые будем подтверждать
    let OrderNumber = [];
    // Получаем список партномеров, добавляем их в массив переменной OrderNumber и включаем у них чекбоксы
    cy.get('.sc-66c9d8a-1.dUQQUc.table').within(() => {
      cy.get('.sc-a56cc42f-2.eORhlC.table-row').then(($elements) => {
        for (let i = 0; i < 3; i++) {
          if ($elements[i] && $elements[i].id) {
            const idWithoutPrefix = $elements[i].id.replace('row-', '');
            OrderNumber.push(idWithoutPrefix);
            cy.wrap($elements[i]).find('.e-checkboxInput').check({ force: true });
          }}
          //Проверяем, что в массиве 3 значения
          expect(OrderNumber.length).to.equal(3);
        });
      }).then(() => {
        cy.log(OrderNumber.toString());
        cy.get('.sc-e9dc91bf-10').first().click();
        cy.wait(10000);
        // Проверяем, что в списке подтвержденных нет наших удаленныз заказов - через вызов api/v1/orders?state=All
        //Получаем токен авторизации и сохраняем его 
        cy.getToken().then(() => {
          OrderNumber.forEach((OrderNumber) => {
            cy.request({
              method: 'GET',
              url: `https://sellerdrivetest.emexauto.com/api/v1/orders?state=All`,
              headers: {
                'Authorization': 'Bearer ' + Cypress.env('access_token'),
                'Content-Type': 'application/json'        
              }
            }).then((response) => {
              expect(JSON.stringify(response.body)).to.not.include(OrderNumber);
            });
          }); 
        });
      });
  });  */
}); 
     