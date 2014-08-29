module.exports = function(year){
	if(year == 2006){
		return {
					start : "<table",
					  end : "</table>",
					  reg : /<a href=".+?" title=".+?">.+?<\/a>/g,
				  linkReg : /href=".+?"/,
				  teamReg : /">.+?</,
				   prefix : 'http://2006.igem.org/'
				}
	}

	if(year == 2007){
		return {
					start : "<TABLE",
					  end : "</TABLE>",
					  reg : /<A.+/g,
				  linkReg : /href='.+?'/,
				  teamReg : /'>.+?</,
				   prefix : ''
				}
	}

	if(year >= 2008 && year <= 2014){
		return {
					start : "<!-- start content -->",
					  end : "<!-- end content -->",
					  reg : /<A.+?\/A>/g,
				  linkReg : /href='.+?'/,
				  teamReg : /'>.+?</,
				   prefix : ''
				}
	}
}