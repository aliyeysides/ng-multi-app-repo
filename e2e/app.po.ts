import { browser, element, by } from 'protractor';

export class ChaikinBearProductPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('cpt-root h1')).getText();
  }
}
