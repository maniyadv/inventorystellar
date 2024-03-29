/* Websocket Implementation */

// Constants 
var hotelids = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
var initBot = false;
var localData = [];
var hotelData = [];

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
			sendAutoSearchRequest();
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
	socketurl = HOST_NAME;
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

// Array to json string and send message 
function createandSendMessage(dataSet) {
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
	socket.send(result);
	return result;
}

// Function to route socket messages 
function routeMessage(msg) {

	if (msg.data) {
		var data = msg.data;
		var msgData = JSON.parse(data);

		if (msgData['s'] == "1") {
			data = msgData['d'];

			switch(msgData['t']) {
				case "search":
					if (msgData['type'] == "auto") {
						autoSearch(data);
						$('.currentinfo').show();
						$('.bookinfo').show();
					} else {
						manualSearch(data);
					}

					// Initiate bot after auto search response 
					if (!initBot) {
						initBot = true;
						setInterval(function() {
							botInterval = botBooking();
						}, botIntensity);
					}
					break;

				case "update":
					updateAvailability(data);
					break;

				case "book":
					if (msgData['m']) {
						postBooking(data);
					}
					break;

				default:
					break;
			}
		}

		if (msgData['m']) {
			//displayInfoToast(msgData['m']);
		}
	}
}

// Display info Toast 
function displayInfoToast(msg) {
	toastr.clear();
	toastr.info(msg);
}

//Display warning Toast 
function displayWarnToast(msg) {
	toastr.clear();
	toastr.warning(msg);
}

// Update availability data 
function updateAvailability(data) {
	for(var key in data) {
		if (data[key].info[currDate]) {
			$(".avail"+data[key].id).html(data[key].info[currDate]);
		}
	}
}

// Parse auto search data 
function autoSearch(data) {
	oldRoomCount = 0;
	newRoomCount = 0;
	$('.totalrooms').html('');

	/*
	 * Inventory for current date only 
	 * 
	$('#availability').html('');
	$('#availability').html('<div class="hotel_list"></div><div class="availability_list"></div>');

	for(var key in data) {
		if (data[key].info[currDate]) {
			roomCount = parseInt(roomCount) + parseInt(data[key].info[currDate]);
			$('.hotel_list').append('<span class="autorow mselect'+data[key].id+'">'+data[key].name+'</span>');

			if (localData && localData[data[key].id] && localData[data[key].id] != data[key].info[currDate]) {
				$('.availability_list').append('<span class="autorow mavail'+data[key].id+'" style="background-color:#acdfb5">'+data[key].info[currDate]+'</span>');
			} else if (data[key].info[currDate] < 1) {
				$('.availability_list').append('<span class="autorow mavail'+data[key].id+'" style="background-color:#ecc8c8">'+data[key].info[currDate]+'</span>');
			} else {
				$('.availability_list').append('<span class="autorow mavail'+data[key].id+'">'+data[key].info[currDate]+'</span>');
			}
			localData[data[key].id] = data[key].info[currDate];
			hotelData[data[key].id] = data[key].name;
		}
	}
	*/

	/*
	 * Inventory for 7 days 
	 */
	$('#availability').html('');

	$('#availability').append('<div class="row invnthead">');
	$('#availability .invnthead').append('<span class="ihead">#</span>');

	var invntDates = [];
	for(var key in data) {
		$('#availability').append('<div class="row invntbody" id ="invnt'+data[key].id+'">');
		$('#availability #invnt'+data[key].id).append('<span class="idata idataHotel mselect'+data[key].id+'">'+data[key].name+'</span>');

		if (!localData[data[key].id]) {
			localData[data[key].id] = [];
		}

		for(var keys in data[key].info) {
			invntDates[keys] = [keys];
			newRoomCount = parseInt(newRoomCount) + parseInt(data[key].info[keys]);

			$('#'+data[key].id+'-'+keys).removeClass('green red');
			if (localData && localData[data[key].id] && localData[data[key].id][keys] && localData[data[key].id][keys] != data[key].info[keys]) {
				$('#invnt'+data[key].id).append('<span class="idata" id="'+data[key].id+'-'+keys+'">'+localData[data[key].id][keys]+'</span>');
				if (!resetClicked) {
					$('#'+data[key].id+'-'+keys).addClass('green');
					$('#'+data[key].id+'-'+keys).slideUp('medium');					
					$('#'+data[key].id+'-'+keys).html(data[key].info[keys]);
					$('#'+data[key].id+'-'+keys).slideDown('medium');
				}
			} else if (data[key].info[keys] < 1) {
				$('#invnt'+data[key].id).append('<span class="idata" id="'+data[key].id+'-'+keys+'">'+data[key].info[keys]+'</span>');
				if (!resetClicked) {
					$('#'+data[key].id+'-'+keys).addClass('red');
				}
			} else {
				$('#invnt'+data[key].id).append('<span class="idata" id="'+data[key].id+'-'+keys+'">'+data[key].info[keys]+'</span>');
			}

			localData[data[key].id][keys] = data[key].info[keys];
			hotelData[data[key].id] = data[key].name;
		}
	}

	for(var date in invntDates) {
		$('#availability .invnthead').append('<span class="ihead">'+date+'</span>');
	}

	//$('.currentdate').html('Date: ' +currDate);
	$('.totalrooms').html(newRoomCount);
	oldRoomCount = newRoomCount;
	resetClicked = false;
}

// Parse manual search data 
function manualSearch(data) {
	$('#listing').html('');

	$('#listing').append('<div class="listhead">');
	$('#listing .listhead').append('<span class="lhead">#</span>');

	var listDates = [];
	for(var key in data) {
		var UA = false;
		$('#listing').append('<div class="'+data[key].id+'">');
		$('#listing .'+data[key].id).append('<span class="mrow ldataHotel mselect'+data[key].id+'">'+data[key].name+'</span>');

		for(var keys in data[key].info) {
			listDates[keys] = [keys];
			if (parseInt(data[key].info[keys]) < parseInt(roomCount)) {
				UA = true;
				$('#listing .'+data[key].id).append('<span class="mrow mavail'+data[key].id+'" style="background-color:#ecc8c8">UA</span>');
			} else {
				$('#listing .'+data[key].id).append('<span class="mrow mavail'+data[key].id+'" style="background-color:#acdfb5">A</span>');
			}
		}

		$('#listing .'+data[key].id).append('<div class="brow form-group"><div class="input-group" id="search'+data[key].id+'"><input type="button" id="book-'+data[key].id+'" class="btn btn-primary" onClick="processBooking(this.id)" name="search" value="Book"></div></div>');
		if (UA) {
			disableBooking('book-'+data[key].id);
		}
	}

	for(var date in listDates) {
		$('#listing .listhead').append('<span class="lhead">'+date+'</span>');
	}

	checkAvailability();
}

// Check room availability 
function checkAvailability() {
	$('.searchinfo').show();
}

// Disable booking on some ids 
function disableBooking(id) {
    $("#"+id).prop("disabled",true);
}

// Post booking 
function postBooking(data) {
	$('.searchinfo').hide();
	$('#listing').html('');
	$('#listing').html('Booking Successful!');
	$('.searchinfo').show();
}

// Bot booking 
function botBooking() {
	var data = new Object();
	var r1 = Math.floor(Math.random() * 7) + 1;
	var r2 = Math.floor(Math.random() * 7) + 1;

	if (r1 < r2) {
		data.checkin = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + (cDate.getDate()+r1);
		data.checkout = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + (cDate.getDate()+r2);
	} else {
		data.checkin = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + (cDate.getDate()+r2);
		data.checkout = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + (cDate.getDate()+r1);
	}
	data.rooms = Math.floor(Math.random() * 5) + 1;
	data.hotelid = hotelids[Math.floor(Math.random()*hotelids.length)];

	data.bot = 'bot';
	data.t = "book";
	data.cd = currDate;
	data.ccheckin = currDate;
	data.ccheckout = invMaxDate;
	console.log(data);

	createandSendMessage(data);
}