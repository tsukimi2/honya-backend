const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

describe('Visual Regression Testing for Login page', () => {
  let browser
  let page

  beforeAll(async function() {
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setui-sandbox",
        "--disable-web-security"
      ]
    })
    page = await browser.newPage()
  })

  afterAll(async function() {
    await browser.close()
  })

  it('Full Page Snapshot', async function() {
    await page.goto('http://honya.co.jp/signin')
    await page.waitForSelector('h2')
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
        failureThresholdType: 'pixel',
        failureThreshold: 500,
    })
  })

  it('Tablet snapshot', async () => {
    await page.goto('http://honya.co.jp/signin')
    await page.waitForSelector('h2')
    await page.emulate(puppeteer.devices['iPad landscape'])
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })

  it('Mobile snapshot', async () => {
    await page.goto('http://honya.co.jp/signin')
    await page.waitForSelector('h2')
    await page.emulate(puppeteer.devices['iPhone X'])
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThresholdType: 'percent',
      failureThreshold: 0.01,
    })
  })
})
