/* When the browser action is clicked, the URL of the current tab is retrieved.
We then iterate through the sites in siteMap, checking for a site matching the URL.
If a match is found, play audio & execute the corresponding script for that site. */

// Array of "site" objects, containing all compatible sites.
// Script _must_ be in sites folder, as other locations are not web accessible.
var siteMap = [
  {
    site: "twitter.com",
    script: "/sites/eurobeat-twitter.js"
  },
  {
    site: "tumblr.com",
    script: "/sites/eurobeat-tumblr.js"
  }
];

var iconInterval;
var iconState = 0;
var iconToggling = false;

// Toggles icon between two images
function toggleIcon() {
  if (iconState === 0) {
    console.log('invert')
    chrome.browserAction.setIcon({path:"icons/icon_invert_16.png"});
    iconState = 1;
  } else if (iconState === 1) {
    console.log('uninvert')
    chrome.browserAction.setIcon({path:"icons/icon_16.png"});
    iconState = 0;
  }
}

// Pauses audio and sets its time back to the start.
function resetAudio() {
  document.getElementById("audioPlayer").pause();
  document.getElementById("audioPlayer").currentTime = 0;
}

// Reset audio & script running state.
function resetScriptState() {
  clearInterval(iconInterval);
  iconToggling = false;
  chrome.browserAction.setIcon({path:"icons/icon_16.png"});
  resetAudio();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "stop_script"});
  });
}

// Sends any onCommitted events to the checkNavigationType function,
// which executes resetScriptState if the onCommitted event was a page reload.
chrome.webNavigation.onCommitted.addListener(checkNavigationType);
function checkNavigationType(details) {
  if (details.transitionType == "reload") {
    resetScriptState();
  }
}

// Pause & reset audio if URL changes.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var urlMap = [];

  if (changeInfo.status == "loading" && changeInfo.url != "undefined") {
    urlMap[tabId] = true;
    resetAudio();
  } else if (urlMap[tabId] && changeInfo.status == "complete") {
    urlMap[tabId] = false;
    resetAudio();
  }
});

// The main function, called when the browser action is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Query the current tab.
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    // Get url of active tab.
    var url = tabs[0].url;

    // Iterate through siteMap, check if url matches any site object.
    for (var i = 0; i < siteMap.length; i += 1) {
      if (url.includes(siteMap[i].site)) {

        // Start toggling icon
        if (iconToggling === false) {
          iconInterval = setInterval(toggleIcon, 100);
          iconToggling = true;
        } else {
          clearInterval(iconInterval);
          chrome.browserAction.setIcon({path:"icons/icon_16.png"});
          iconToggling = false;
        }

        console.log("background.js: Match in sitemap found. Starting audio and sending message to content.js");

        // Get script from matching site object
        var script = siteMap[i].script;
        var audioPlayer = document.getElementById("audioPlayer");

        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          resetAudio();
        }

        var activeTab = tabs[0];

        // Send message to the tab, saying the browser action was clicked, along
        // with the path of the script that should be executed.
        // The content.js file listens for this message.
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "script": script, "site": siteMap[i].site});
      }
    }
  });
});
