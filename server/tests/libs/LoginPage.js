export default class LoginPage {
  constructor(page) {
    this.page = page
  }

  async login(username, password) {
    await this.page.waitAndType('#username', username)
    await this.page.waitAndType('#password', password)
    await this.page.waitAndClick('button[type="submit"]')
  }
}
