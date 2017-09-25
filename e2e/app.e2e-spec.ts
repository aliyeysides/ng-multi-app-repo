import { ChaikinBearProductPage } from './app.po';

describe('chaikin-bear-product App', () => {
  let page: ChaikinBearProductPage;

  beforeEach(() => {
    page = new ChaikinBearProductPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('cpt works!');
  });
});
