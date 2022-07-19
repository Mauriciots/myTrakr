const originUrl = new URL(origin)
const BASE_ENDPOINT = originUrl.hostname.includes('heroku')
  ? 'https://mytrakr-tomaz.herokuapp.com'
  : 'http://localhost:3000'
