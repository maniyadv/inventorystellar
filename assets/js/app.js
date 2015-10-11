// Constants 
var DEFAULT_ROOMS = 1;
var DEFAULT_IN_PROCESS = ' in process!';
var DEFAULT_BOOKING_DAYS = 0;
var cDate = new Date();
var currDate = cDate.getFullYear() + '-' + (cDate.getMonth()+1) + '-' + cDate.getDate();
	

// Websocket Global object variable
var socket = null;

// Ready 
$(document).ready(function () {
    processFields();
});

//Book button click handling 
$('#search').click(function() {

	processAvailabilitySearch();
});

// Book button click handling 
$('#book').click(function() {

//	processBooking();
});

// Processes form fields 
function processFields() {
    // Intensity field 
	$('#intensity').on('change', function (e) {
		console.log('Intensity: '+ $('#intensity').val());
    });

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

// Processes search request 
function processAvailabilitySearch() {
	var result = validateInput();

	if (result['status'] == 'Y') {
    	var data = new Object();
    	data.checkin =  $('input[name=checkin]').val();
    	data.checkout =  $('input[name=checkout]').val();
    	data.rooms =  $('input[name=rooms]').val();

    	var infoStr = '';
    	infoStr = 'BOOKING DETAILS : ' + ' </br> ' + 
    			  'Check-in: '+ data.checkin + ' </br> ' + 
    			  'Check-out: '+ data.checkout + ' </br> ' + 
    			  'Rooms: '+ data.rooms;
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
	toastr.success('Search' + DEFAULT_IN_PROCESS);
	data.t = "search";
	data.type= "manual";
	createandSendMessage(data);
}