const fs = require('fs')
const xlsx = require('xlsx');

const workbook = xlsx.readFile(`${__dirname}/codeList.xls`)
const sheetName = workbook.SheetNames[0]
const worksheet = workbook.Sheets[sheetName]
const data = xlsx.utils.sheet_to_json(worksheet, {header:1})

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

module.exports.getCode = schoolName => {
  let code = false
  data.forEach(row => {
    if(row[2] === schoolName) {
      code = row[0]
    }
  })

  return code
}

module.exports.getDomain = schoolName => {
  let domain = false
  data.forEach(row => {
    if(row[2] === schoolName) {
      domain = row[1]
    }
  })

  return getDomainCode(domain)
}
