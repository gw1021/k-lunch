﻿<h1 align="center">K-lunch</h1>
A node.js module for serving lunch-menu.
<div>
<a href="https://www.npmjs.com/package/k-lunch"><img src="https://badge.fury.io/js/k-lunch.svg" alt="npm version" height="18"></a>
</div>

## Table of contents

- [Example](#example)
- [Installation](#installation)
- [Form](#form)
- [Method](#method)

## Warning

#### This module is at Alpha-stage. There's no error handling and may not behave as you intended.

## Installation
```
npm install k-lunch
```

## Testing
You can edit test.js for testing.

```
npm test
```

## Example
```js
const klunch = require('k-lunch')

const form = {
  year: 2017,
  month: 2,
  day: 7,
  time: 2, // Breakfast = 1, Lunch = 2, Dinner = 3
  name: '서정고등학교',
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
```

## Form

#### Structure
```js
const form = {
  year: 2017,
  month: 2,
  day: 7,
  time: 2, // Breakfast = 1, Lunch = 2, Dinner = 3
  name: "yourSchoolName",
  code: "yourSchoolCode", // Please check out http://www.neis.go.kr/2013susi_CodeList.xls
  domain: "yourDomainCode",
  phase: 4 // Elementary School = 2, Middle School = 3, High School = 4
}
```

## Method

#### .getLunch

```js
klunch.getLunch(form, callback, options)
```

## Options

- `autoCode: boolean` - Automatically gets school code and replaces form.code with it.
- `autoDomain: boolean` - Automatically gets domain code and replaces form.domain with it.
