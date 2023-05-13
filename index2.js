const Parser = require("rss-parser");
const RSS = require("rss");
const fs = require("fs");

// We need to add iTunes specific namespaces to parse them
let parser = new Parser({
  customFields: {
    item: [
      ["itunes:duration", "itunesDuration"],
      ["itunes:explicit", "itunesExplicit"],
      ["itunes:image", "itunesImage"],
    ],
  },
});

const feedUrls = [
  // "https://achtungamerikaner.libsyn.com/rss",
  // "https://audio.nobodyhasthe.biz/api/v1/channels/ascendingthespectrum_official/rss",
  // "https://audio.nobodyhasthe.biz/api/v1/channels/thefinalstormishere/rss",
  // "https://anchor.fm/s/5b4028c8/podcast/rss", // great men of our history  --nope
  // "https://media.rss.com/johnfashcroft/feed.xml",
  // "https://anchor.fm/s/7bbe76b8/podcast/rss", // this time the multiverse  --nope
  // "https://feeds.libsyn.com/325607/rss", // hate house
  // "https://anchor.fm/s/9510ca1c/podcast/rss", // audio invictus            --nope
  // "https://anchor.fm/s/b68e7bbc/podcast/rss", // the white corner          --nope
  // "https://fullhaus.libsyn.com/rss",
  // "https://feeds.libsyn.com/106598/rss", // godcast
  // "https://anchor.fm/s/b4c7199c/podcast/rss", // involution
  // "https://audio.nobodyhasthe.biz/api/v1/channels/therealsmokepit/rss",
  // "https://audio.nobodyhasthe.biz/api/v1/channels/thegamerword/rss",
  // "https://odysee.com/$/rss/@FizeekFriday:d", // odysee files are too big.... YIKES
  // "https://feeds.feedburner.com/archive/littlewarspodcast",
  // "https://anchor.fm/s/3f92428c/podcast/rss", // daily decade
  "https://audio.nobodyhasthe.biz/api/v1/channels/amerikanercommunityradio/rss",
  "https://audio.nobodyhasthe.biz/api/v1/channels/exodus_americanus/rss",

  // Add more feed URLs here
];

async function run() {
  let feedPromises = feedUrls.map(async (feedUrl) => {
    var feed;
    try {
      feed = await parser.parseURL(feedUrl);
    } catch (err) {
      console.log("\nYIKES: " + feedUrl + "\n" + err);
    }
    return feed;
    //parser.parseURL(feedUrl);
  });
  let feeds = await Promise.all(feedPromises);

  let items = [];

  // Combine all feed items
  feeds.forEach((feed) => {
    if (feed) {
      items = items.concat(feed.items);
    }
  });

  // Sort by date and take only the latest 100
  items.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
  items = items.slice(0, 100);

  // Create new RSS feed
  var feed = new RSS({
    title: "Combined Podcast RSS",
    description: "This is a combined feed of multiple podcasts",
    feed_url: "http://example.com/rss.xml",
    site_url: "http://example.com",
    image_url: "http://example.com/logo.png",
    docs: "http://example.com/rss/docs.html",
    managingEditor: "Editor Name",
    webMaster: "Webmaster Name",
    copyright: "2023 Your Name",
    language: "en",
    categories: ["Category 1", "Category 2"],
    pubDate: new Date().toUTCString(),
    ttl: "60",
    itunesAuthor: "Your Name",
    itunesSubtitle: "A combined feed of multiple podcasts",
    itunesSummary: "This is a combined feed of multiple podcasts",
    itunesOwner: { name: "Your Name", email: "you@example.com" },
    itunesExplicit: false,
    itunesCategory: [
      {
        text: "Main Category",
        subcats: [
          {
            text: "Sub Category",
          },
        ],
      },
    ],
    itunesImage: "http://example.com/itunes-image.jpg",
    itunesType: "episodic",
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
  });

  // Add items to the feed
  items.forEach((item) => {
    feed.item({
      title: item.title,
      description: item.content,
      url: item.link,
      guid: item.guid,
      categories: item.categories,
      author: item.creator,
      date: item.isoDate,
      enclosure: { url: item.enclosure.url, type: item.enclosure.type },
      itunesAuthor: item.itunesAuthor,
      itunesExplicit: item.itunesExplicit,
      itunesSubtitle: item.itunesSubtitle,
      itunesImage: item.itunesImage && item.itunesImage.href,
      itunesDuration: item.itunesDuration,
    });
  });

  // Output the RSS feed as XML
  var rssFeedPath = "./feed.rss";
  fs.writeFileSync(rssFeedPath, feed.xml());
  console.log("Completed");
}

run().catch(console.error);
