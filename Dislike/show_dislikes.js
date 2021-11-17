/**
   * Sample JavaScript code for youtube.videos.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

//alert("runnin")
console.log(document)
var loc = location.href
var split_url = loc.split("watch?v=")
if (split_url.length > 1) {
  //alert("On youtube watch!")
  vid_id = split_url[1].split("&t=")[0]
  chrome.runtime.sendMessage({ greeting: "get_dislikes", msg: vid_id }, function (response) {
    //alert("This video has " + response[0] + " dislikes")
    setTimeout(set_dislike_text(response[1], response[0]), 1000)
  });
}
else {
  //alert("not on youtube :(")
}
function set_dislike_text(prev_dislikes, new_dislikes) {
  prev_dislikes = prev_dislikes
  for (var txt of document.getElementsByClassName("style-scope ytd-toggle-button-renderer style-text")) {
    if (txt.textContent == "Dislike" || txt.textContent == prev_dislikes)
      txt.textContent = new_dislikes
  }
  for (var txt of document.getElementsByClassName("style-scope ytd-toggle-button-renderer style-default-active")) {
    if (txt.textContent == "Dislike" || txt.textContent == prev_dislikes)
      txt.textContent = new_dislikes
  }
}


