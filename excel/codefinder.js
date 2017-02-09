const fs = require('fs')
const xlsx = require('xlsx');

const workbook = xlsx.readFile(`${__dirname}/excel/codeList.xls`)
const sheetName = workbook.SheetNames[0]
const worksheet = workbook.Sheets[sheetName]
const data = xlsx.utils.sheet_to_json(worksheet, {header:1})

module.exports.getCode = schoolName => {
  let code = false
  data.forEach(row => {
    if(row[2] === schoolName) {
      code = row[0]
    }
  })

  return code
}
