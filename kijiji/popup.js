window.onload= attach
var url
function attach(){
	var checkPageButton = document.getElementById('checkPage');
	checkPageButton.onclick=buttonReact;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		url = tabs[0].url;
	});

}

function buttonReact(){
	var domain_regex = new RegExp("https?:\/\/(www.)?kijiji\.ca")
	res = domain_regex.test(url);

	console.log(res);
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

