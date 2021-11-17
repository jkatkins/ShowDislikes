// chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
//   chrome.tabs.executeScript(null, {
//     file: "show_dislikes.js"
//   });
// });

chrome.tabs.onUpdated.addListener(function (details) {
  chrome.tabs.executeScript(null, {
    file: "show_dislikes.js"
  });
});

var prev_dislikes = "Dislikes"

function authenticate() {
  return gapi.auth
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
}
function loadClient(apiKey, sendResponse) {
  gapi.client.setApiKey(apiKey);
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function () {
      console.log("GAPI client loaded for API");
      sendResponse("API key successfully saved!")
    },
      function (err) {
        console.error("Error loading GAPI client for API", err);
        sendResponse("Error reading API key, please try again ")
      });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(id, sendResponse) {
  gapi.client.youtube.videos.list({
    "part": [
      "statistics"
    ],
    "id": [
      id
    ]
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
      result = response.result
      items = result.items
      num_dislikes = response.result.items[0].statistics.dislikeCount
      if (num_dislikes.toString().length > 6)
        num_dislikes = Math.floor(num_dislikes / 1000000) + "M"
      else if (num_dislikes.toString().length > 3)
        num_dislikes = Math.floor(num_dislikes / 1000) + "K"
      num_dislikes = num_dislikes + " "
      console.log(num_dislikes)
      console.log(prev_dislikes)
      sendResponse([num_dislikes, prev_dislikes])
      prev_dislikes = num_dislikes
    },
      function (err) { console.error("Execute error", err); });

}

window.gapi_onload = function () {
  console.log('gapi loaded.', gapi.auth, gapi.client);
  console.log(gapi.auth)
  authenticate()
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.greeting === "get_dislikes") {
      var id = request.msg;
      execute(id, sendResponse)
      return true
    }
    if (request.greeting === "set_apiKey") {
      var apiKey = request.msg;
      loadClient(apiKey, sendResponse)
      console.log("loaded apikey")
      return true
    }
  }
);

