## Smart Index Spec:

1. This is a series of scripts used to index the links on iGEM.org, organize them into a nice format, finally generate static pages.

2. Smart Index will be hosted as a **contribution project**, with links in/out from iGEMCC.org

### Extractor
The online archive of 20**.igem.org is from 2006 to now, 2014

2006 and 2007's pages are designed in a different ways from 2008 and after that.

#### 2006
* [Team List](http://2006.igem.org/wiki/index.php/Schools_Participating_in_iGEM_2006)
* [Example: UArizona](http://2006.igem.org/wiki/index.php/University_of_Arizona_2006)

#### 2007
* [Team List](http://2007.igem.org/IGEM2007_Team_List)
* [Example: Alberta](http://2007.igem.org/Alberta)

#### 2008 ~ 2014
* [Team List](http://igem.org/Team_List?year=20**)
* [Example: USTC](http://igem.org/Team.cgi?id=82)

### Process
The basic data unit would be a JSON object stored in a levelDB:
```
{
	key : team + '@' + year,
	value : {
				link: link
			}
}
```
* `team`: Team name
* `year`: Year of competition
* `link`: Link to the team's page in that year

### Generator
The generator is responsible to collect the information from DB, then output as HTML.

Since the data is stored in DB and the `value` can have many more attribute pairs, so you can customize the generator to show the information you want to how in the way you like.