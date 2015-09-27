window.onload= attach

var urlRegex = new RegExp("https?:\/\/(www.)?kijiji\.ca")
var url

function attach(){
	var checkPageButton = document.getElementById('check');
	checkPageButton.onclick=buttonReact;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		url = tabs[0].url;
		if (urlRegex.test(url)) {
			/* ...if it matches, send a message specifying a callback too */
			chrome.tabs.sendMessage(tabs[0].id, { text: "price" }, doStuffWithDOM);
		}
	});

}

function buttonReact(){
		res = urlRegex.test(url);
	if (res){
		// is kijiji!
		//let's start scraping!
		//console.log();

	}
}


/* A function creator for callbacks */
function doStuffWithDOM(domContent) {
    console.log("I received the following DOM content:\n" + domContent);
}


function sentTab(tab){{
	  d = document;

	  var f = d.createElement('form');
	  f.action = 'http://localhost:80';
	  f.method = 'post';
	  var i = d.createElement('input');
	  i.type = 'hidden';
	  i.name = 'url';
	  i.value = tab.url;
	  f.appendChild(i);
	  d.body.appendChild(f);
	  f.submit();
	}
}

