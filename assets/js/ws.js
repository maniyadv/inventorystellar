/* Websocket Implementation */

// Constants 
var PUBLIC_DNS_URL = '127.0.1.1';

// Ready 
$(document).ready(function() {
	connect();
});

// Create socket method
function createSocket(host) {
	try {
		if (window.WebSocket)
			return new WebSocket(host);
		else if (window.MozWebSocket)
			return new MozWebSocket(host);
	} catch (ex) {
		log('failed creating socket connection  at - ' + host);
	}
}

// Initiate socket connection
function init() {
	if (socket != null) {
		socket.close();
	}
	var host = 'ws://' + socketurl + ':9660/invnt';

	try {
		socket = createSocket(host);
		log('WebSocket - status ' + socket.readyState);

		socket.onopen = function(msg) {
			log('Welcome - status ' + this.readyState);
			log('Connected to - ' + host);
			document.getElementById('status').style.backgroundColor = '#acdfb5';

			var dataObj = new Object();
			dataObj.t = "search";
			dataObj.type= "auto";
			var msg = createMessage(dataObj);
			log(msg);

			socket.send(msg);
		};

		socket.onmessage = function(msg) {
			log('WebSocket - message received ' + msg);
			routeMessage(msg);
		};

		socket.onclose = function(msg) {
			log('Disconnected - status ' + this.readyState);
			document.getElementById('status').style.backgroundColor = '#ecc8c8';
		};
	} catch (ex) {
		log(ex);
	}
}

// Connect to socket url
function connect() {
	socketurl = PUBLIC_DNS_URL;
	if (socketurl == '') {
		log('Enter valid url for connection');
		return;
	}

	//$('#logtexts').html('');
	//$('#connectbtn').text('Connecting ...');
	if (socket != null) {
		socket.close();
	}
	socket = null;

	// Initiate new connection
	init();
}

// Quit socket connection
function quit() {
	if (socket != null) {
		socket.close();
		socket = null;
	} else {
		log('Socket already in disconnected state');
	}
}

// Send to socket connection
function send(msg) {
	try {
		if (socket != null) {
			socket.send(msg);
		} else {
			log('Issue with socket connection');
		}
	} catch (ex) {
		log(ex);
	}
}

// Utility - log 
function log(msg) {
	//document.getElementById('logtexts').innerHTML += '<br>[SOCKET] ' + msg;
	//$('#log').animate({scrollTop: $('#log').prop('scrollHeight')}, 500);
	var logStr = '\n [SOCKET] ' + msg;
	console.log(logStr);
}

// Utility - logResponse 
function logResponse(msg) {
	//document.getElementById('logtexts').innerHTML += '<br><text class='responseTxt'>[SOCKET] ' + msg + '</text>';
	//$('#log').animate({scrollTop: $('#log').prop('scrollHeight')}, 500);
	var logStr = '\n [SOCKET] ' + msg;
	console.log(logStr);
}

/*
// Utility - setMsg 
function setMsg() {
	$('#msg').text($('#tasklist').val());
}

// Utility - onKey 
function onKey(event) {
	if (event.keyCode == 13) {
		send();
	}
}
*/

// Array to json string 
function createMessage(dataSet) {
	/*
	 * For extra arguments 
	 *
	if (argSet) {
		var argResult = JSON.parse(argSet);
		if (argResult && Object.keys(argResult).length > 0) {
			for (key in argResult) {
				dataObj[key] = argResult[key];
			}
		}
	}
	*
	*/

	var result = JSON.stringify(dataSet);
	return result;
}

// Function to route socket messages 
function routeMessage(msg) {

	if (msg.data) {
		var data = msg.data;
		msgData = JSON.parse(data);

		if (msgData['s'] == "1") {
			data = msgData['d'];

			switch(msgData['t']) {
				case "search":
					parseResponse(data);
					break;

				case "update":
					updateData(data);
					break;

				default:
					break;
			}

			if (msgData['m']) {
				toastr.info(msgData['m']);
			}
		}
	}
}

// Parse data 
function parseResponse(data) {

	$('#availability').html('');
	$('#availability').append('<div class="dateavail">Date: '+currDate+'</div>');

	for(var key in data) {
		$('#availability').append('<div class="'+data[key].id+'">');
		$('#availability').append('<span class="hotelname">'+data[key].name+'</span>'+' : ');
		$('#availability').append('<span class="hotelavail">'+data[key].info[currDate]+'</span>');
		//$('#availability').append('<div class="dateavail">'+currDate+'</div>');
		$('#availability').append('</div>');
	}
}

// Update data 
function updateData(data) {

	for(var key in data) {
//		$('#'+data[key].id.hotelavail).html(data[key].info[currDate]);
	}
}
