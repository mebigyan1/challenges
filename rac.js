const requests = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('underscore');

const request = requests.defaults({jar: true});

request('http://secretmsg.6te.net/chpage.php', (error, response, html) => {
	var dataArray = [];
	var wordlst = [];
	var words = "{";

	function getFrequency(string) {
	    var freq = {};
	    for (var i=0; i<string.length;i++) {
	        var character = string.charAt(i);
	        if (freq[character]) {
	           freq[character]++;
	        } else {
	           freq[character] = 1;
	        }
	    }
	    return freq;
	};
	const cook = response.headers['set-cookie'];

	if(!error && response.statusCode == 200) {
		const $ = cheerio.load(html);
		$('li').each((i,el) => {
			const item = $(el).text();
			dataArray.push(item.trim());
		});
		console.log(dataArray);
	}

	fs.readFile('new_wordlist.txt', "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		wordlst.push(data.split("\n"));
		for(var l=0;l<dataArray.length;l++) {
			var one = getFrequency(dataArray[l]);
			for(var k=0;k<wordlst[0].length;k++) {
				var two = getFrequency(wordlst[0][k]);
				if (_.isEqual(one, two)) {
					words+=wordlst[0][k]+" ";
				}
			}
		}
		words = words.slice(0,-1);
		words=words+"}";

		var form = {
		    ans: words,
		    name: 'John Doe',
		    roll: 'Rollno'
		};

		var contentLength = form.length;

		request.post({
		    headers: {
		      'Content-Length': contentLength,
		      'Content-Type': 'application/x-www-form-urlencoded'
		    },
		    url: 'http://secretmsg.6te.net/result.php',
		    form: form
		  }, function (err, res, body) {
		  	console.log(body);
		  	console.log(words);
		  });
	});
});

