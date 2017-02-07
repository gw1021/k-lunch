# k-lunch
k-lunch Project 

## Table of contents

- [Example](#example)
- [Form](#form)
- [Method](#method)

## Warning

#### This module is at Alpha-stage. There's no error handling and may not behave as you intended.

## Example
```js
let express = require('express');
let klunch = require('klunch');

let router = express.Router();

router.get('/', function(req, res, next) {
  const year = req.query.yy,
    month = req.query.mm,
    day = req.query.dd,
    time = req.query.time,
    name = req.query.name,
    code = req.query.code,
    phase = req.query.phase;

  const form = {
    year: year,
    month: month,
    day: day,
    time: time,
    name: name,
    code: code,
    phase: phase
  }

  klunch.getLunch(form, (output) => {
    res.json(output);
  });
});

module.exports = router;
```

## Form
*** You need to convert year, month, day to String manually! ***
(Will implement feature about this in the future.)

#### Examples
```js
const form = {
  year: '2017',
  month: '02',
  day: '07',
  time: 2, // Breakfast = 1, Lunch = 2, Dinner = 3
  name: schoolName,
  code: schoolCode,
  phase: 4 // Elementary School = 2, Middle School = 3, High School = 4
}
```

## Method

#### .getLunch

```js
klunch.getLunch(form, callback);
```
