// Injects site script on page.
// Runs when Browser Action is clicked on a supported site.

var myInterval;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    var eurobeatScript = document.getElementById('eurobeat-script');
    if (eurobeatScript === null) {
      try {
        console.log("[EUROBEAT] content.js: Browser action message received, injecting script: " + request.script);

        // Create and append script element.
        var el = document.createElement('script');
        el.type = "text/javascript";
        el.src = chrome.runtime.getURL(request.script);
        el.id = 'eurobeat-script';
        (document.head || document.documentElement).appendChild(el);
        console.log("[EUROBEAT] content.js: Site script injected!");
      } finally {
        runScript(request.site);
        myInterval = setInterval(function() { runScript(request.site) }, 3000);
      }
    } else {
      eurobeatScript.remove();
      clearInterval(myInterval);
    }
  }

  if (request.message === "stop_script") {
    var eurobeatScript = document.getElementById('eurobeat-script');
    if (eurobeatScript === null) {
      // do nothing, script isn't even running!
    } else {
      eurobeatScript.remove();
      clearInterval(myInterval);
    }
  }
});

function runScript(site) {
  console.log("[EUROBEAT] Script running!");
  var args;
  if (site === "twitter.com") {
    args = runSiteScriptTwitter();
  }
  if (site === "tumblr.com") {
    args = runSiteScriptTumblr();
  }
  replaceContent(...args);
}

/* Replaces elements.
For each selector in "selectors", find everything that matches root + selector,
then replace every match with given replacement (depending on type).
Text should be replaced with an HTML string, media with an image URL.*/
function replaceContent(rootSelector, selectors, replacementText, replacementMedia) {
  var root = document.querySelectorAll(rootSelector);
  for (var x = 0; x < selectors.length; x += 1) {
    for (var i = 0; i < root.length; i += 1) {
      var elements = root[i].querySelectorAll(selectors[x].selector + ':not(.eurobeat)');
      if (elements.length != 0) {
        if (selectors[x].type === "text") {
          for (var j = 0; j < elements.length; j += 1) {
            elements[j].innerHTML = replacementText;
            elements[j].classList.add('eurobeat');
          }
        } else if (selectors[x].type === "media") {
          for (var j = 0; j < elements.length; j += 1) {
            var imgH = elements[j].offsetHeight;
            var imgW = elements[j].offsetWidth;
            elements[j].innerHTML = '<img src="' + replacementMedia + '" height="' + imgH + '" width="' + imgW + '"></img>';
            elements[j].classList.add('eurobeat');
          }
        } else if (selectors[x].type === "delete") {
          for (var j = 0; j < elements.length; j += 1) {
            elements[j].remove();
          }
        } else {
          console.log("Unknown selector type: " + selectors[x].type);
        }
      }
    }
  }
}
