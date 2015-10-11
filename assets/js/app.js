// Constants 
var DEFAULT_ROOMS = 1;
var DEFAULT_IN_PROCESS = 'Booking in process!';
var DEFAULT_BOOKING_DAYS = 2;


// Websocket Global object variable
var socket = null;


$(document).ready(function () {
    processFields();
});

// Book button click handling 
$('#book').click(function() {

	processBooking();
});

// Processes form fields 
function processFields() {
    // Intensity field 
	$('#intensity').on('change', function (e) {
		console.log('Intensity: '+ $('#intensity').val());
    });

    // Current Date setting 
	var d = new Date();
	var checkinDate = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
	var checkoutDate = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + (d.getDate()+DEFAULT_BOOKING_DAYS);
	$('input[name=checkin]').val(checkinDate);
	$('input[name=checkout]').val(checkoutDate);

    // Check-in Date field 
	$('#checkin').on('change', function (e) {
    	console.log('Check-in: '+ $('input[name=checkin]').val());
    });

	// Check-out Date field 
    $('#checkout').on('change', function (e) {
    	console.log('Check-out: '+ $('input[name=checkout]').val());
    });

	// Rooms field 
    $('#rooms').on('change', function (e) {
    	console.log('Rooms: '+ $('input[name=rooms]').val());
    });
}

// Processes booking request 
function processBooking() {
	var result = validateInput();

	if (result['status'] == 'Y') {
    	var data = [];
    	data['intensity'] =  $('#intensity').val();
    	data['checkin'] =  $('input[name=checkin]').val();
    	data['checkout'] =  $('input[name=checkout]').val();
    	data['rooms'] =  $('input[name=rooms]').val();

    	var infoStr = '';
    	infoStr = 'BOOKING DETAILS' + ' </br> ' + 
        		  'Intensity: '+ data['intensity'] + ' </br> ' + 
    			  'Check-in: '+ data['checkin'] + ' </br> ' + 
    			  'Check-out: '+ data['checkout'] + ' </br> ' + 
    			  'Rooms: '+ data['rooms'];
    	toastr.info(infoStr);

    	sendRequest(data);
	} else {
		toastr.warning(result['error']);
	}
}

// Validates input data on all fields - Default data processing 
function validateInput() {
	var result = [];
	result['status'] = 'Y';
	result['error'] = '';

	if (!$('input[name=rooms]').val()) {
    	$('input[name=rooms]').val(DEFAULT_ROOMS);
	} else 
	if ($('input[name=rooms]').val() == '0') {
		result['error'] = 'Cannot book 0 rooms!';
	}

	if (result['error']) {
		result['status'] = 'N';
	}

	return result;
}

// Sends request to websocket 
function sendRequest(data) {
	toastr.success(DEFAULT_IN_PROCESS);
	console.log(data);
}


// ################### Websocket Implementation Starts ###################

// create socket method
function createSocket(host) {
	try {
        if (window.WebSocket)
            return new WebSocket(host);
        else if (window.MozWebSocket)
            return new MozWebSocket(host);
	} catch (ex) { 
		log("failed creating socket connection  at - " + host);
    }
}


// initiate socket connection
function init() {
	if(socket != null) {
		socket.close(); 
	}                 
    var host = "ws://" + socketurl + ":9400/hook";
    
    try {
        socket = createSocket(host);
        log('WebSocket - status ' + socket.readyState);

        socket.onopen 		= function(msg) {
			                    log("Welcome - status " + this.readyState);
        						log("Connected to - " + host);
        						document.getElementById("status").style.backgroundColor = "#acdfb5";                   
        					 };
        				
        socket.onmessage    = function(msg) {

        					};
        					
        socket.onclose      = function(msg) {
                               log("Disconnected - status " + this.readyState);
           					   document.getElementById("status").style.backgroundColor = "#ecc8c8";
        					};
    }
    catch (ex) {
        log(ex);
    }              
}

// send to socket connection
function send(msg) {
    try {  
       if(socket != null)  { socket.send(msg);  }
        			 else  { log("issue with socket connection"); } 
    } catch (ex) {
        log(ex);
    }
}


// connect to socket url
function connect() {
	socketurl = "socket_url";
	if (socketurl == "") {
		log("Enter valid url for connection");
		return;
	}
    
	//$("#logtexts").html("");
	//$("#connectbtn").text("connecting ...");
	if (socket != null) {
		socket.close();
	}
    socket  = null;

	// initiate new connection
	init();
}


 
// quit socket connection
function quit() {
    if(socket != null) {
        socket.close();
        socket = null;                        
    } else {
        log("socket already in disconnected state");
    }
}

//################### Websocket Implementation Ends ###################




// Utilities
function log(msg) {
	  //document.getElementById("logtexts").innerHTML += "<br>[SOCKET] " + msg;
      //$('#log').animate({scrollTop: $('#log').prop("scrollHeight")}, 500);
	  console.log(msg);
}
function logresponse(msg) {
	 //document.getElementById("logtexts").innerHTML += "<br><text class='responseTxt'>[SOCKET] " + msg + "</text>";
	 //$('#log').animate({scrollTop: $('#log').prop("scrollHeight")}, 500);
}

/*function setmsg() {
    $("#msg").text($("#tasklist").val());
}
function onkey(event) {
    if (event.keyCode == 13) {
        send();
    }
}*/

