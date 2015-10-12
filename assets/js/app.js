// Constants 
var DEFAULT_ROOMS = 1;
var DEFAULT_IN_PROCESS = ' in process!';
var DEFAULT_BOOKING_DAYS = 0;
var DEFAULT_INV_MAX_DAYS = 6;
var cDate = new Date();
var currDate = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + cDate.getDate();
var invMaxDate = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + (cDate.getDate()+DEFAULT_INV_MAX_DAYS);
var roomCount = 0;
var botIntensity = 20000;
var botInterval;

// Websocket Global object variable
var socket = null;

// Ready 
$(document).ready(function () {
    processFields();
});

// Book button click handling 
$('#search').click(function() {

	processAvailabilitySearch();
});

// Reset button click handling 
$('#reset').click(function() {

	sendResetRequest();
});

// Roll numbers 
function rollNumbers(start, end, id) {
	$(id).html('');

	var beginRolling = function() {
	    $(id).html(start);

	    if (start != end) {
	    	setTimeout(beginRolling, 10);
	    }
	    start++;
	};

	beginRolling();
}

// Processes form fields 
function processFields() {
    // Intensity field 
	$('#intensity').on('change', function (e) {
		console.log('Intensity: '+ $('#intensity').val());

		var intensity = $('#intensity').val();
		if (intensity == "slow") {
			botIntensity = 30000;
		} else if (intensity = "medium") {
			botIntensity = 20000;
		} else if (intensity = "fast") {
			botIntensity = 10000;
		}
		clearInterval(botInterval);
		setInterval(function() {
			botInterval = botBooking();
		}, botIntensity);

    });

	console.log('Bot Intensity: '+botIntensity);

	// Current Date setting 
	var checkinDate = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + cDate.getDate();
	var checkoutDate = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + (cDate.getDate()+DEFAULT_BOOKING_DAYS);
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
function processBooking(id) {
	var result = validateInput();

	if (result['status'] == 'Y') {
    	var data = new Object();
    	data.checkin =  $('input[name=checkin]').val();
    	data.checkout =  $('input[name=checkout]').val();
    	data.rooms =  $('input[name=rooms]').val();

    	// TODO: Remove useless string in front of id - Unique 
    	data.hotelid = id.substring(5);

    	var infoStr = '';
    	infoStr = 'BOOKING DETAILS : ' + ' </br> ' + 
    			  'Check-in: '+ data.checkin + ' </br> ' + 
    			  'Check-out: '+ data.checkout + ' </br> ' + 
    			  'Rooms: '+ data.rooms;
    	displayInfoToast(infoStr);

    	sendBookingRequest(data);
	} else {
		displayWarnToast(result['error']);
	}
}

// Processes search request 
function processAvailabilitySearch() {
	var result = validateInput();

	if (result['status'] == 'Y') {
    	var data = new Object();
    	data.checkin =  $('input[name=checkin]').val();
    	data.checkout =  $('input[name=checkout]').val();
    	data.rooms =  $('input[name=rooms]').val();

    	var infoStr = '';
    	infoStr = 'SEARCH DETAILS : ' + ' </br> ' + 
    			  'Check-in: '+ data.checkin + ' </br> ' + 
    			  'Check-out: '+ data.checkout + ' </br> ' + 
    			  'Rooms: '+ data.rooms;
    	displayInfoToast(infoStr);

    	sendSearchRequest(data);
	} else {
		displayWarnToast(result['error']);
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

// Sends auto search request to websocket 
function sendAutoSearchRequest() {
	var data = new Object();
	data.t = "search";
	data.type = "auto";
	data.cd = currDate;
	data.checkin = currDate;
	data.checkout = invMaxDate;
	data.rooms = ''+DEFAULT_ROOMS;
	createandSendMessage(data);
}

// Sends manual search request to websocket 
function sendSearchRequest(data) {
	displayInfoToast('Search' + DEFAULT_IN_PROCESS);
	data.t = "search";
	data.type = "manual";
	data.cd = currDate;
	createandSendMessage(data);
	roomCount = $('input[name=rooms]').val();
}

// Sends booking request to websocket 
function sendBookingRequest(data) {
	displayInfoToast('Booking' + DEFAULT_IN_PROCESS);
	data.t = "book";
	data.ccheckin = currDate;
	data.ccheckout = invMaxDate;
	createandSendMessage(data);
	roomCount = $('input[name=rooms]').val();
}

// Sends reset request to websocket 
function sendResetRequest() {
	var data = new Object();
	data.t = "reset";
	data.checkin = currDate;
	data.checkout = invMaxDate;
	createandSendMessage(data);
}