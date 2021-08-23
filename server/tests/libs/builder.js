import puppeteer from 'puppeteer'

export default class Builder {
  static async build(viewport) {
    const launchOptions = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setui-sandbox",
        "--disable-web-security"
      ]
    }

    // https://github.com/puppeteer/puppeteer/issues/1645
    // headless chrome inside docker-compose net::ERR_CONNECTION_REFUSED
    // https://stackoverflow.com/questions/57167903/chrome-inside-docker-err-connection-refused
    // https://github.com/SeleniumHQ/docker-selenium/issues/520
    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    const extendedPage = new Builder(page)
    page.setDefaultTimeout(30000)
    page.setDefaultNavigationTimeout(30000)

    switch(viewport) {
      case 'Mobile':
        const mobileViewport = puppeteer.devices['iPhone X']
        await page.emulate(mobileViewport)
        break
      case 'Tablet':
        const tabletViewport = puppeteer.devices['iPad landscape']
        await page.emulate(tabletViewport)
        break
      case 'Desktop':
        await page.setViewport({ width: 1920, height: 1080 })
        break
      default:
        throw new Error("Supported devices are only Mobile | Tablet | Desktop")
    }

    return new Proxy(extendedPage, {
      get: function(_target, property) {
        return extendedPage[property] || browser[property] || page[property]
      }
    })
  }

  constructor(page) {
    this.page = page
  }

  async waitAndClick(selector) {
    await this.page.click(selector)
  }

  async waitAndType(selector, text) {
    await this.page.waitForSelector(selector)
    await this.page.type(selector, text)
  }

  async getText(selector) {
    await this.page.waitForSelector(selector)
    const text = await this.page.$eval(selector, e => e.innerHTML)
    return text
  }

  async isElementVisible(selector) {
    let visible = true

    try {
      await this.page.waitForSelector(selector, { visible: true, timeout: 30000 })
    } catch(err) {
      visible = false
    }
    
    return visible
  }

  async blur(selector) {
    await this.page.$eval(selector, e => e.blur())
  }
}

/*

export default class Builder {
  constructor(page) {
    this.page = page;
  }
 
  async waitAndClick(selector) {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }
 
  async waitAndType(selector, text) {
    await this.page.waitForSelector(selector);
    await this.page.type(selector, text);
  }
 
  async getText(selector) {
    await this.page.waitForSelector(selector);
    const text = await this.page.$eval(selector, e => e.innerHTML);
    return text;
  }
 
  async getCount(selector) {
    await this.page.waitForSelector(selector);
    const count = await this.page.$$eval(selector, items => items.length);
    return count;
  }
 
  async waitForXPathAndClick(xpath) {
    await this.page.waitForXPath(xpath);
    const elements = await this.page.$x(xpath);
    if (elements.length > 1) {
      console.warn("waitForXPathAndClick returned more than one result");
    }
    await elements[0].click();
  }
 
  async isElementVisible(selector) {
    let visible = true;
    await this.page
      .waitForSelector(selector, { visible: true, timeout: 3000 })
      .catch(() => {
        visible = false;
      });
    return visible;
  }
 
  async isXPathVisible(selector) {
    let visible = true;
    await this.page
      .waitForXPath(selector, { visible: true, timeout: 3000 })
      .catch(() => {
        visible = false;
      });
    return visible;
  }
}
*/