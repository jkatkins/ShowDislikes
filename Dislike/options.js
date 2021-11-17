document.getElementById("save").addEventListener("click", saveApiKey);

function saveApiKey() {
  console.log('asd');
  var responseText = document.getElementById("response");
  responseText.textContent = "loading..."
  var apiKey = document.getElementById("wptk").value
  chrome.runtime.sendMessage({ greeting: "set_apiKey", msg: apiKey }, function (response) {
    responseText.textContent = response
  });
}