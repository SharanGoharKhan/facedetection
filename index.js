const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const { run } = require('./worker/faceExtraction')

const app = express()
const port = process.env.PORT || 3000


app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

//public folder path for static file like js,css,images
app.use(express.static('public'))

app.use('/', async (req, res, next) => {
    let images = await run()
    res.json({ res: true, images })
})
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})