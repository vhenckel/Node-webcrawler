const express = require('express')
const router = express.Router()
const request = require('request')
const cheerio = require('cheerio')

router.get('/', (req, res) => {
  res.render('crawler/index', {
    title: 'Web Crawler',
    msg: 'Welcome to web crawler...'
  })
})

router.post('/', (req, res) => {
  if (!req.body.search_term) return res.redirect('/')
  let search_term = req.body.search_term.split(' ').join('+')
  request(`https://google.com/search?q=${search_term}&oq=${search_term}`, (err, response, body) => {
    if (err || response.statusCode != 200) return res.redirect('/')

    let $ = cheerio.load(body)
    let data = []

    $('.r')
      .each((key, element) => {
        let header = $(element).find('a').text()
        let link = $(element).find('a').attr('href')
        data.push({
          header,
          link
        })
      })
    if (!data.length) {
      return res.redirect('/')
    }

    req.session.result_data = data
    req.session.msg = 'RESULT'
    console.log('req: ', req.session)
    return res.redirect('/result')
  })

})

router.get('/result', (req, res) => {
  let result = req.session_result_data

  req.session_result_data = []

  return res.render('crawler/result', {
    data: result,
    msg: req.session.msg
  })
})

module.exports = router