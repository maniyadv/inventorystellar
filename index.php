<!DOCTYPE html>
	<!--[if lte IE 6]><html class='preIE7 preIE8 preIE9'><![endif]-->
	<!--[if IE 7]><html class='preIE8 preIE9'><![endif]-->
	<!--[if IE 8]><html class='preIE9'><![endif]-->
	<!--[if gte IE 9]><!-->
<html>
	<!--<![endif]-->
	<head>
		<title>FabHotels</title>
		<meta charset='UTF-8'>
		<meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>
        <meta name='viewport' content='width=device-width, initial-scale=1'>

        <link href='http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css' rel='stylesheet' type='text/css'>
        <link href='http://pingendo.github.io/pingendo-bootstrap/themes/default/bootstrap.css' rel='stylesheet' type='text/css'>
        <link href='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css' rel='stylesheet' type='text/css'>
        <link href='assets/css/style.css' rel='stylesheet' type='text/css'>

        <style type='text/css'>
		</style>
	</head>
    <body data-spy='scroll'>

    	<!-- Socket Status -->
    	<div id="status"></div>

    	<!-- Content Section -->
    	<div class='section'>
    	    <div class='container'>
    	    	<div class='row'>

				<form class='navbar-form' >

					<h2>Booking</h2>

					<!-- Booking Intensity -->
					<div class='form-group'>
						<?php echo 'Booking Intensity'; ?> </br> 
						<select class='form-control' name='intensity' id='intensity'>
							<option value='slow'>Slow</option>
							<option value='medium'>Medium</option>
							<option value='fast'>Fast</option>
		                </select>
					</div>
					</br> </br> 

					<!-- Hotel Info -->
					<div class='form-group'>
						<?php echo 'Today'; ?>
						<div class='totalrooms'><?php echo ' '; ?> </div>
						<div class='input-group' id='availability'></div>
					</div>
					</br> </br> 

					<!-- Email -->
					<div class='form-group'>
						<div class='input-group' id='email'>
							<?php echo 'Email'; ?> </br> 
							<input type='email' class='form-control' name='email' placeholder='name@example.com' >
						</div>
					</div>
					</br> </br> 

					<!-- Booking Info -->
					<div class='bookinfo' style='display:none'>

						<!-- Check-in Date -->
						<div class='form-group'>
							<div class='input-group date' id='checkin'>
								<?php echo 'Check-in'; ?> </br> 
								<input type='date' class='form-control' name='checkin' >
							</div>
						</div>
	
						<!-- Check-out Date -->
						<div class='form-group'>
							<div class='input-group date' id='checkout'>
								<?php echo 'Check-out'; ?> </br> 
								<input type='date' class='form-control' name='checkout' >
							</div> 
						</div>
	
						<!-- Rooms -->
						<div class='form-group'>
							<div class='input-group' id='rooms'>
								<?php echo 'No. of Rooms'; ?> </br> 
								<input type='text' class='form-control' name='rooms' placeholder='<?php echo '1'; ?>' >
							</div> 
						</div>

						<!-- Check Button -->
						<div class='form-group'>
							<div class='input-group' id='check'>
								<?php echo '&nbsp'; ?> </br> 
								<input type='button' class='btn btn-primary' name='check' value='Check' > 
							</div>
						</div>
					</div>

				</form>

				</div>
			</div>
		</div>
	</body>

	<script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
    <script type='text/javascript' src='http://netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js'></script>
    <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js'></script>
    <script type='text/javascript' src='assets/js/app.js'></script>
    <script type='text/javascript' src='assets/js/ws.js'></script>

    <script type='text/javascript'>
	</script>
</html>