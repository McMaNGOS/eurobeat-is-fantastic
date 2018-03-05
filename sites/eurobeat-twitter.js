// EUROBEAT for Twitter

function runSiteScriptTwitter() {
  // Selector for tweets in Twitter stream (root element).
  var root = "#stream-items-id > li > div.tweet > div.content, #stream-items-id > li > ol > li > div.tweet > div.content";

  /* array of selector objects
  each object has a selector and a type (text, media, or delete)
  the selector should be written as if it's chained from the root element */
  var selectors = [
                  {type: "text", selector: "div.js-tweet-text-container"},
                  {type: "text", selector: "div.QuoteTweet-text"},
                  {type: "media", selector: "div.QuoteMedia-container > div[class^='QuoteMedia']"},
                  {type: "media", selector: "div.AdaptiveMedia-photoContainer"},
                  {type: "media", selector: "div.AdaptiveMedia-videoContainer"},
                  {type: "delete", selector: "div.card2"}
                ];

  // Replacement elements (HTML for text elements, image url for media elements).
  var replacementMedia = "https://media.giphy.com/media/xT0xesuj8NugXn2efC/giphy.gif";
  var replacementText = "<marquee>Eurobeat is fantastic</marquee>";

  // Create an array containing all our variables.
  var args = [root, selectors, replacementText, replacementMedia];

  return args;
}
