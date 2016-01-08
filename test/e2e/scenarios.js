/* global browser, by, element, expect */

"use strict";

describe('Document App', function () {

    it('document app test', function () {
        browser.get('/');
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toEqual('/docs');
        });

        var pList = element.all(by.css('a.list-group-item'));
        expect(pList.count()).toBe(1);
        
        pList.get(0).click();

        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toEqual('/docs/dms');
        });
        
        expect(element.all(by.repeater('doc in searchResult')).count()).toBe(2);
        
        var categories = element.all(by.repeater("category in project.categories"));
        
        expect(categories.count()).toBe(2);
        
        var a = categories.get(0).element.all(by.repeater("doc in project.docs"));
        
        expect(a.count()).toBe(2);
        
        expect(element.all(by.repeater("doc in project.docs")).count()).toBe(6);

        element(by.model('search')).sendKeys('search');

        var searchList = element.all(by.repeater('doc in searchResult'));
        expect(searchList.count()).toBe(1);
    });

    it('test2', function () {
        browser.get('/docs/dms');
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toEqual('/docs/dms');
        });
    });

    /*
     describe('Phone list view', function() {
     
     beforeEach(function() {
     browser.get('app/index.html#/phones');
     });
     
     
     it('should filter the phone list as a user types into the search box', function() {
     
     var phoneList = element.all(by.repeater('phone in phones'));
     var query = element(by.model('query'));
     
     expect(phoneList.count()).toBe(20);
     
     query.sendKeys('nexus');
     expect(phoneList.count()).toBe(1);
     
     query.clear();
     query.sendKeys('motorola');
     expect(phoneList.count()).toBe(8);
     });
     
     
     it('should be possible to control phone order via the drop down select box', function() {
     
     var phoneNameColumn = element.all(by.repeater('phone in phones').column('phone.name'));
     var query = element(by.model('query'));
     
     function getNames() {
     return phoneNameColumn.map(function(elm) {
     return elm.getText();
     });
     }
     
     query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter
     
     expect(getNames()).toEqual([
     "Motorola XOOM\u2122 with Wi-Fi",
     "MOTOROLA XOOM\u2122"
     ]);
     
     element(by.model('orderProp')).element(by.css('option[value="name"]')).click();
     
     expect(getNames()).toEqual([
     "MOTOROLA XOOM\u2122",
     "Motorola XOOM\u2122 with Wi-Fi"
     ]);
     });
     
     
     it('should render phone specific links', function() {
     var query = element(by.model('query'));
     query.sendKeys('nexus');
     element.all(by.css('.phones li a')).first().click();
     browser.getLocationAbsUrl().then(function(url) {
     expect(url).toEqual('/phones/nexus-s');
     });
     });
     });
     
     
     describe('Phone detail view', function() {
     
     beforeEach(function() {
     browser.get('app/index.html#/phones/nexus-s');
     });
     
     
     it('should display nexus-s page', function() {
     expect(element(by.binding('phone.name')).getText()).toBe('Nexus S');
     });
     
     
     it('should display the first phone image as the main phone image', function() {
     expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
     });
     
     
     it('should swap main image if a thumbnail image is clicked on', function() {
     element(by.css('.phone-thumbs li:nth-child(3) img')).click();
     expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
     
     element(by.css('.phone-thumbs li:nth-child(1) img')).click();
     expect(element(by.css('img.phone.active')).getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
     });
     });
     
     */
});
