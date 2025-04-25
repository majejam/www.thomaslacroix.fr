const express = require('express')
const path = require('path')

const app = express()
const publicPath = path.join(process.cwd(), 'dist')
const port = 8080

app.use('/', express.static(publicPath, { index: false }))
app.get('/*', (request, response) => {
	response.sendFile(`${publicPath}/index.html`)
})

app.listen(port, '0.0.0.0')

// eslint-disable-next-line no-console
console.log('Server started!')


