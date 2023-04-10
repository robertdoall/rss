const fs = require('fs');
// const readline = require('readline');
let Parser = require('rss-parser');
var filePath = './file.json';
var rssFeedPath = './feed.rss';
try { fs.unlinkSync(filePath); } catch (err) { console.log (err); }
try { fs.unlinkSync(rssFeedPath); } catch (err) { console.log (err); }

var podList = [
	'https://achtungamerikaner.libsyn.com/rss',
	'https://audio.nobodyhasthe.biz/api/v1/channels/ascendingthespectrum_official/rss',
	'https://audio.nobodyhasthe.biz/api/v1/channels/thefinalstormishere/rss',
	'https://anchor.fm/s/5b4028c8/podcast/rss', // great men of our history  --nope
	'https://media.rss.com/johnfashcroft/feed.xml', 
	'https://anchor.fm/s/7bbe76b8/podcast/rss', // this time the multiverse  --nope
	'https://feeds.libsyn.com/325607/rss',      // hate house
	'https://anchor.fm/s/9510ca1c/podcast/rss', // audio invictus            --nope
	'https://anchor.fm/s/b68e7bbc/podcast/rss', // the white corner          --nope
	'https://fullhaus.libsyn.com/rss',
	'https://feeds.libsyn.com/106598/rss',      // godcast
	'https://anchor.fm/s/b4c7199c/podcast/rss', // involution
	'https://audio.nobodyhasthe.biz/api/v1/channels/therealsmokepit/rss',
	'https://audio.nobodyhasthe.biz/api/v1/channels/thegamerword/rss',
	'https://odysee.com/$/rss/@FizeekFriday:d', // odysee files are too big.... YIKES
	'https://feeds.feedburner.com/archive/littlewarspodcast',
	'https://anchor.fm/s/3f92428c/podcast/rss', // daily decade
	'https://audio.nobodyhasthe.biz/api/v1/channels/amerikanercommunityradio/rss',
	'https://audio.nobodyhasthe.biz/api/v1/channels/exodus_americanus/rss'
];

/*TBD reading from a file vs an array
var ffeeds = [];
async function processLineByLine() {
	const fileStream = fs.createReadStream('feeds.txt');
  
	const rl = readline.createInterface({
	  input: fileStream,
	  crlfDelay: Infinity
	});
  
	for await (const line of rl) {
	  // console.log(`Line from file: ${line}`);
		ffeeds.push(line);
	}
}
*/
  
let parser = new Parser();
var entries = [];
var promises = podList.map(function(pod) {
		return new Promise(async function(resolve, reject) {
			var feed;
			try { feed = await parser.parseURL(pod); } catch (err) { console.log('\nYIKES: ' + pod + '\n' + err) } 
			if (feed != null) {
				feed.items.forEach(item => {
					if (item != null || item.title != null) {
			    fs.appendFile(filePath,
					JSON.stringify(item) + ',\n'
					, err => {
						if (err) { throw err; }
			  	});
		  		entries.push(item);
					}
				});
				console.log('Processed; ' + feed.title);
			}
			resolve();
		});
});


function byDate(a, b) {
  return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
}

Promise.all(promises)
.then(function() { 
	console.log('\nAll Fetched\nSorting\n');	
	entries = entries.sort(byDate);
	console.log('Newest Pod', entries[0]);

	var jsonFeed = {
		channel: {
			title:"Amerikaner master feed",
			copyright: "All Rights Reserved",
			"itunes:explicit": "no",
			link:"https://amerikaner.org/",
			home_page_url:"https://amerikaner.org/",
			feed_url:"https://amerikaner.org/",
			description: "A simple truncated in some contexts.",
			next_url:"https://amerikaner.org/",
			icon:"https://amerikaner.org/",
			author:{
				 name:"Big Rig TFT",
				 url:"https://amerikaner.org/",
				 avatar:"https://amerikaner.org/"
			},
			_itunes:{
				 about:"https://amerikaner.org/",
				 owner: {
					 email: "georgefloyd@gmail.com"
		 		},
				 image: "https://amerikaner.org",
				 category: "INFO",
				 subcategory: "Entertainment"
			},
			items: [entries]
		}
	};

	function JSONtoXML(obj) {
		let xml = '';
		for (let prop in obj) {
			xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
			if (obj[prop] instanceof Array) {
				for (let array in obj[prop]) {
					xml += '\n<' + prop + '>\n';
					xml += JSONtoXML(new Object(obj[prop][array]));
					xml += '</' + prop + '>';
				}
			} else if (typeof obj[prop] == 'object') {
				xml += JSONtoXML(new Object(obj[prop]));
			} else {
				xml += obj[prop];
			}
			xml += obj[prop] instanceof Array ? '' : '</' + prop + '>\n';
		}
		xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
		return xml;
	}
	
	const entriesXML = JSONtoXML(jsonFeed);
	fs.writeFileSync(rssFeedPath,
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
		"<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\" xmlns:itunes=\"http://www.itunes.com/dtds/podcast-1.0.dtd\"" +
		"xmlns:media=\"http://search.yahoo.com/mrss/\">"	+
		entriesXML + "</rss>", "utf8");
})
.catch(console.error);
