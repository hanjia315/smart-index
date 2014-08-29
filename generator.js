var level = require('level');
var db = level('./data');
var fs = require('fs');

var header = "<html><body><ul>";
var tail = "</ul></body></html>";

getData();

function getData(){
	var content = "";
	db.createReadStream()
	  .on('data', function (data) {
	    var info = data.key + '=' +data.value;
	  	content += "<li>" + info + "</li>";
	  })
	  .on('error', function (err) {
	    console.log('Oh my!', err)
	  })
	  .on('close', function () {
	    console.log('Stream closed')
	  })
	  .on('end', function () {
	  	fs.writeFile('list.html', header + content + tail, function (err) {
	  	  if (err) throw err;
	  	  console.log('It\'s saved!');
	  	});
	  });
}