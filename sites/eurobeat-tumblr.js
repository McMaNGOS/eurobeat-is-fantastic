// EUROBEAT for Tumblr

function runSiteScript() {
  var root = "ol#posts > li:not(.new_post_buttons_container)";

  var selectors = [
                  {type: "text", selector: "div.reblog-title"},
                  {type: "text", selector: "div.reblog-content"},
                  {type: "text", selector: "div.post_title"},
                  {type: "text", selector: "div.post_body > p"},
                  {type: "text", selector: "div.note_item > div.text > p:not(.asker)"},
                  {type: "text", selector: "div.post_tags_inner"},
                  {type: "text", selector: "div.answer"},
                  {type: "text", selector: "span.banner_text"},
                  {type: "text", selector: "div.track-name"},
                  {type: "text", selector: "div.track-artist"},
                  {type: "text", selector: "div.notification_sentence > div.hide_overflow"},
                  {type: "text", selector: "div.notification_sentence > blockquote"},
                  {type: "media", selector: "div.post_media"},
                  {type: "media", selector: "figure.tmblr-full"},
                  {type: "media", selector: "div.audio-image"}
                ];

  var replacementMedia = "https://media.giphy.com/media/3ojtwC9PSTtl0txLYh/giphy.gif";
  var replacementText = "<marquee>Eurobeat is fantastic</marquee>";

  var args = [root, selectors, replacementText, replacementMedia];

  return args;
}
