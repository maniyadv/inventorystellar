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
	    <?php 
			require_once 'config/config.php';
	
			$fp = fsockopen(HOST_NAME, 9660, $errno, $errstr, 5);
			if (!$fp) {
				// port is closed or blocked
				// echo "port is not running";
				shell_exec('php app/console/ws/server.ws.php > /dev/null 2>&1 &');	
			} else {
				// port is open and available	
				// echo "port is running";	
				fclose($fp);
			}
		?>

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
					<div class='currentinfo' style='display:none'>
						<div class='form-group'>
							<div class='currentdate'><?php echo ' '; ?> </div>
							<div class='totalrooms'><?php echo ' '; ?> </div>
							<div class='input-group' id='availability'></div>
						</div>
						</br> </br>
					</div> 

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

						<!-- Search Button -->
						<div class='form-group'>
							<div class='input-group' id='search'>
								<?php echo '&nbsp'; ?> </br> 
								<input type='button' class='btn btn-primary' name='search' value='Search' > 
							</div>
						</div>
						</br> </br>

						<!-- Search Info -->
						<div class='searchinfo' style='display:none'>
							<div class='form-group'>
								<div class='input-group' id='listing'></div>
							</div>
							</br> </br>
						</div> 
					</div>

				</form>

				</div>
			</div>
		</div>
	</body>

	<script type='text/javascript'>
    	var HOST_NAME = '<?php echo HOST_NAME; ?>';
	</script>

	<script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
    <script type='text/javascript' src='http://netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js'></script>
    <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js'></script>
    <script type='text/javascript' src='assets/js/app.js'></script>
    <script type='text/javascript' src='assets/js/ws.js'></script>
</html>