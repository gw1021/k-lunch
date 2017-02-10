const cheerio = require('cheerio')
const request = require('request')
const codefinder = require('./excel/codefinder')

const pad = d => (d < 10) ? '0' + d.toString() : d.toString()

const getDomainCode = (domain) => {
  switch(domain) {
    case '서울특별시':
      return 'sen'
      break
    case '부산광역시':
      return 'pen'
      break
    case '대구광역시':
      return 'dge'
      break
    case '인천광역시':
      return 'ice'
      break
    case '광주광역시':
      return 'gen'
      break
    case '대전광역시':
      return 'dge'
      break
    case '울산광역시':
      return 'use'
      break
    case '세종특별자치시':
      return 'sje'
      break
    case '경기도':
      return 'goe'
      break
    case '강원도':
      return 'kwe'
      break
    case '충청북도':
      return 'cbe'
      break
    case '충청남도':
      return 'cne'
      break
    case '전라북도':
      return 'jbe'
      break
    case '전라남도':
      return 'jne'
      break
    case '경상북도':
      return 'gbe'
      break
    case '경상남도':
      return 'gne'
      break
    case '제주특별자치도':
      return 'jje'
      break
  }
}

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
      form.domain = getDomainCode(domain)
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
          dataSchema.menu = e.substring(0, intIndex)
          dataSchema.allergyInfo = e.substring(intIndex, e.length - 1).split('.')
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