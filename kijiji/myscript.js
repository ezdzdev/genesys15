var xPrice= '//*[@id="itemdetails"]/div[2]/table/tbody/tr[2]/td/div/span/strong'

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    /* If the received message has the expected format... */
alert(1);
    if (msg.text && (msg.text == "price")) {
        /* Call the specified callback, passing 
           the web-pages DOM content as argument */
		response = getElementByXpath(xPrice)
        sendResponse(response);
    }
});

function getElementByXpath(path) {
  alert(document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
}
