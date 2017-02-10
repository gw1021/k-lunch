const klunch = require('./index')

const form = {
  year: 2017,
  month: 2,
  day: 7,
  time: 2, // Breakfast = 1, Lunch = 2, Dinner = 3
  name: '행신고등학교',
  phase: 4 // Elementary School = 2, Middle School = 3, High School = 4
}

const options = {
  autoCode: true,
  autoDomain: true
}

klunch.getLunch(form, (err, output) => {
  if(err) throw err
  console.log(output)
}, options)