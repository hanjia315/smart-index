// Exact the content
var http = require('http');
var level = require('level');
var db = level('./data');
var getMeta = require('./getMeta.js')

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
	    	var items = process(year, raw);
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

function process(year, raw){
		var meta = getMeta(year);

		raw = raw.toString();
		var start = raw.indexOf(meta.start);
		var end = raw.indexOf(meta.end);
		raw = raw.slice(start, end);
		
		if(year >= 2008 && year <= 2014)
			raw = raw.split('\n').join(' ');

		var arr = raw.match(meta.reg);
		
		if(year == 2006)
			arr = arr.filter(function(item){return (item.match(/(gif|jpg)/g) == null) && (item.match(/nbsp/g) == null)});
	
		var items = arr.map(function(item){
			var link = item.match(meta.linkReg)[0];
			var team = item.match(meta.teamReg)[0];

			return {
				link : meta.prefix + link.slice(6, -1),
				team : team.slice(2, -1)
			}
		});
		return items;
}