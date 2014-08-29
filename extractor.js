// Exact the content
var http = require('http');
var level = require('level');
var db = level('./data');

extractor(2007);

function pushData(items, year){
	var options = items.map(function (item){
		return {
			type : 'put',
			key : item.team + '@' + year,
		  	value: 
		  		{
		    		link : item.link
		  		},
		  	valueEncoding: 'json'
			}
		});

	db.batch(options, function (err) {
	  if (err) return console.log('Ooops!', err)
	  console.log('Great success dear leader!')
	})
}

function extractor(year) {
	url = getURL(year);

	http.get(url, function(res) {
		var raw = "";
	    res.on('data', function (chunk) { raw += chunk });
	    res.on("end", function() { 
	    	var items = getProcess(year)(raw);
    		pushData(items, year);
	    }).on("error", function() {
			throw error;
	  	});
	})
}

function getURL(year){
	if(year == 2006)
		return "http://2006.igem.org/wiki/index.php/Schools_Participating_in_iGEM_2006";
	else if(year == 2007)
		return "http://2007.igem.org/IGEM2007_Team_List";
	else if(year >= 2008 && year <= 2014)
		return "http://igem.org/Team_List?year=" + year
}

function getProcess(year){
	if (year == 2006){
		return function(raw){
			raw = raw.toString();
			var start = raw.indexOf("<table");
			var end = raw.indexOf("</table>");
			raw = raw.slice(start, end);

			var arr = raw.match(/<a href=".+?" title=".+?">.+?<\/a>/g).filter(function(item){return (item.match(/(gif|jpg)/g) == null) && (item.match(/nbsp/g) == null)});
			var items = arr.map(function(item){
				var link = item.match(/href=".+?"/)[0].slice(6, -1);
				var team = item.match(/">.+?</)[0].slice(2, -1);
				var prefix = "http://2006.igem.org/"
				return {
					link : prefix + link,
					team : team
				}
			});
			return items;
		}
	}

	if (year == 2007){
		return function(raw){
			raw = raw.toString();
			var start = raw.indexOf("<TABLE");
			var end = raw.indexOf("</TABLE>");
			raw = raw.slice(start, end);

			var arr = raw.match(/<A.+/g)

			var items = arr.map(function(item){
				var link = item.match(/href='.+?'/)[0].slice(6, -1);
				var team = item.match(/'>.+?</)[0].slice(2, -1);
				return {
					link : link,
					team : team
				}
			});
			return items;
		}
	}

	if(year == 2008){
		return function(raw){
			raw = raw.toString();
			var start = raw.indexOf("<!-- start content -->");
			var end = raw.indexOf("<!-- end content -->");
			raw = raw.slice(start, end);
			raw = raw.split('\n').join(' ');
			var arr = raw.match(/<A.+?\/A>/g);
			var items = arr.map(function(item){
						var link = item.match(/href='.+?'/)[0].slice(6, -1);
						var team = item.match(/'>.+?</)[0].slice(2, -1);
						return {
							link : link,
							team : team
						}
					});
			return items;
		}
	}
}