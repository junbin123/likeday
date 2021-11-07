/* eslint-disable no-path-concat */
console.log('watchPage.js...')
const routes = require('../src/routes')
console.log('---------------888', __dirname, routes)
const fs = require('fs')
const path = __dirname + '/../src/pages.json'
fs.writeFile(path, JSON.stringify(routes), err => (err ? console.error(err) : console.log('success')))
