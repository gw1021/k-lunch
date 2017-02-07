let cheerio = require('cheerio');
let request = require('request');

function max_date(year, month){
	switch(month){
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return 31;
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			return 30;
			break;
		case 2:
			if(year % 4 === 0){
				return 29;
			}
			else{
				return 28;
			}
			break;
		default:
			return 30;
			break;
	}
}

function pad(d) {
	return (d < 10) ? '0' + d.toString() : d.toString();
}

const URL = 'http://stu.goe.go.kr/sts_sci_md01_001.do';

module.exports.getLunch = function(form, callback) {
	const reqForm = {
		"schYmd": form.year + form.month + form.day,
		"schMmealScCode": form.time,
		"insttNm": form.name,
		"schulCode": form.code,
		"schulKndScCode": pad(form.phase),
		"schulCrseScCode": form.phase
	}

	request({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url: 'http://stu.goe.go.kr/sts_sci_md01_001.do',
		form: reqForm
	}, function(err, res_post, body){
		if(err) {
			callback(err);
		} else {
			let $ = cheerio.load(body, {decodeEntities: false});

			const mixedDate = [form.year, form.month, form.day].join('.');

			let index = 0;
			let data = '';
			let dataArr = [];
			let output = [];

			$('table > thead > tr').each(function() {
				let rows = $(this).find('th');

				for(let i = 1; i < 8; i++) {
					let rowText = rows.eq(i).text();
					rowText.search(mixedDate) !== -1 ? index = i : i
				}
			});

			$('table > tbody').each(function() {
				let lunchTr = $(this).find('tr').eq(1);
				let lunchInfo = lunchTr.find('td').eq(index - 1).html();
				data = lunchInfo;
			});

			dataArr = data.split('<br>');
			dataArr.pop();

			dataArr.forEach(e => {
				let intIndex = e.search(/\d/); //finds first int and returns index of it.
				let dataScheme = {
					menus: '',
					nuts: ''
				}

				dataScheme.menus = e.substring(0, intIndex);
				dataScheme.nuts = e.substring(intIndex, e.length - 1).split('.');
				output.push(dataScheme);
			});

			callback(output);
		}
	});
}

/*if($('table > thead > tr > td').text() === '자료가 없습니다.') {
	res.json('Error!')
}*/
