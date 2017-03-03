const cheerio = require('cheerio')
const request = require('request')
const codefinder = require('./excel/codefinder')

const pad = d => (d < 10) ? '0' + d.toString() : d.toString()

module.exports.getLunch = (form, callback, options) => {
  const ymdArr = [form.year, form.month, form.day]
  const ymd = ymdArr.map(v => pad(v)).join('')

  if(options) {
    const schoolName = form.name

    if(options.autoCode === true) {
      const schoolCode = codefinder.getCode(schoolName)
      form.code = schoolCode
    }

    if(options.autoDomain === true) {
      const domain = codefinder.getDomain(schoolName)
      form.domain = domain
    }
  }

  const reqForm = {
    "schYmd": ymd,
    "schMmealScCode": form.time,
    "insttNm": form.name,
    "schulCode": form.code,
    "schulKndScCode": pad(form.phase),
    "schulCrseScCode": form.phase
  }

  const URL = `http://stu.${form.domain}.go.kr/sts_sci_md01_001.do`

  request({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url: URL,
    form: reqForm
  }, (err, res_post, body) => {
    if(err) {
      callback(err, null)
    } else {
      const $ = cheerio.load(body, {decodeEntities: false})
      const mixedDate = ymdArr.map(v => pad(v)).join('.')

      let index = 0
      let data = ''
      let dataArr = []
      let output = []

      $('table > thead > tr').each(function() {
        let rows = $(this).find('th')
        
        for(let i = 1; i < 8; i++) {
          let rowText = rows.eq(i).text();
          rowText.search(mixedDate) !== -1 ? index = i : i
        }
      });

      $('table > tbody').each(function() {
        let lunchTr = $(this).find('tr').eq(1)
        let lunchInfo = lunchTr.find('td').eq(index - 1).html()
        data = lunchInfo;
      });

      if(data === null || $('table > thead > tr > td').text() === '자료가 없습니다.') {
        callback("There's no data in table.", null)
      } else {
        dataArr = data.split('<br>')
        dataArr.pop()

        dataArr.forEach(e => {
          let intIndex = e.search(/\d/); //finds first int and returns index of it.
          let dataSchema = {
            menu: '',
            allergyInfo: ''
          }

          if(intIndex === -1) {
            dataSchema.menu = e
          } else {
            dataSchema.menu = e.substring(0, intIndex)
            dataSchema.allergyInfo = e.substring(intIndex, e.length - 1).split('.')
          }
          
          output.push(dataSchema)
        });

        if(output[0] == null) {
          callback("There's no data in table.", null)
        } else {
          callback(null, output)
        }        
      }
    }
  });
}