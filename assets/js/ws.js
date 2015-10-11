/* Websocket Implementation */

// Constants 

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
	var host = 'ws://' + socketurl + ':9400/hook';

	try {
		socket = createSocket(host);
		log('WebSocket - status ' + socket.readyState);

		socket.onopen = function(msg) {
			log('Welcome - status ' + this.readyState);
			log('Connected to - ' + host);
			document.getElementById('status').style.backgroundColor = '#acdfb5';
		};

		socket.onmessage = function(msg) {
			
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
	socketurl = 'socket_url';
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
	//init();
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
