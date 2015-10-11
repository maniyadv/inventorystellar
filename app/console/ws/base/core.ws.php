<?php 

/**
 * Class to work with core logic 
 * and data manipulation
 * @author
 *
 */


class Core {
	protected $_coreconfig = array();
	protected $_bookings   = array();
	
	/**
	 * Constructor for class
	 */
	function __construct() {
		$this->_bookings   = array();		
		$this->_coreconfig = array();
		
		$this->loadConfig();
		
	}
	
	/**
	 * Method to load initial config
	 */
	function loadConfig() {
		$conf = array();
		$hotels = array();
		
		$hotels["hotels"] = array('A', 'B' , 'C', 'D', 'E', 'F', 'G', 'H',
								'I', 'J', 'K', 'L', 'M', 'N');
		
		foreach($hotels["hotels"] as $key => $val) {
			$conf[$val]['info']  = array(date('Y-m-d') => ''.rand(10, 50));
			$conf[$val]['name']  = 'Hotel - '.$val;
			$conf[$val]['id']    = $val;
		}
				
		$this->_coreconfig = $conf;
	}
	
	
	/**
	 * method search for task search
	 * @param unknown_type $param
	 */
	public function search($param) {
		$response = array();
		
		if($param["type"] == "auto") {
			$response["s"]    = "1";
			$response["t"]    = $param["t"];
			$response["m"]    = "Loaded initial data";
			$response["d"]    = $this->_coreconfig;
			$response["type"] = $param["type"];
			$param["client"]->send(json_encode($response));			
		}
		
		 if ($param["type"] == "manual") {
						
			$hotels 		  = $this->findAvailableHotels($param);
						
			$response["s"]    = "1";
			$response["t"]    = $param["t"];
			$response["type"] = $param["type"];	
			$response["m"]    = "Search Finished";
			$response["d"]    = $hotels;
			$param["client"]->send(json_encode($response));
		} 

	}
	
	/**
	 * Method to find available hotels
	 * @param unknown_type $param
	 */
	public function findAvailableHotels($param) {
		$this->say("calculating hotel");
		
		$roomsreq = $param["rooms"];
		$checkin  = $param["checkin"];
		$checkout = $param["checkout"];
		
		// initial hotels data, remove all info related to availability
		$hotelsdata = $this->_coreconfig;
		foreach ($this->_coreconfig as $key => $val) {
			$hotelsdata[$key]['info'] = array();
		}
			
		
		// Format check in checkout dates
		$start   = new DateTime($checkin);
		$end     = new DateTime($checkout);
		
		$days = $end->diff($start)->format("%a");
		
		$date = $start;
		$date = $date->format('Y-m-d');
				
		
		// Loop till number of days
		for($i = 0; $i <= $days; $i++) {

			// update start day for next day
			if($i != 0) {				
				$date = $start->modify('+1 day');
				$date = $date->format('Y-m-d');				
			}
			
			// Get current hotel config	
			$conf = $this->_coreconfig;			
						
			foreach ($conf as $key => $val) {
				
				// booked rooms
				$booked = 0;
				
				$availarr = array_values($conf[$key]['info']);
				$baseavail = $availarr[0];
				
				if (isset($this->_bookings) && !empty($this->_bookings)) {
					if (isset($this->_bookings[$val])) {
						if (isset($this->_bookings[$val][$date])) {
							if (isset($this->_bookings[$val][$date]["rooms"])) {
								$booked = $this->_bookings[$val][$date]["rooms"];
							}					
						}
					}
				}
				
				$currentavail = $baseavail - $booked;			
				$hotelsdata[$key]['info'][$date] = "".$currentavail;
			}
			
		}
				
		return $hotelsdata;		 
	}
	
	/**
	 * Method to book hotel rooms
	 * @param unknown_type $param
	 */
	function book($param) {
		$canbebooked = array();
		$booking     = array();
		
		$roomsreq    = $param["rooms"];
		$checkin     = $param["checkin"];
		$checkout    = $param["checkout"];
		$hotelid     = $param["hotelid"];
		
		// Format check in checkout dates
		$start   = new DateTime($checkin);
		$end     = new DateTime($checkout);
		
		$days = $end->diff($start)->format("%a");
		
		$date = $start;
		$date = $date->format('Y-m-d');
		
		// Loop till number of days
		for($i = 0; $i <= $days; $i++) {
		
			// update start day for next day
			if($i != 0) {
				$date = $start->modify('+1 day');
				$date = $date->format('Y-m-d');
			}
			
			
			// Get current hotel config
			$conf = $this->_coreconfig;
			
			foreach ($conf as $key => $val) {
				if ($key != $hotelid) continue;
				
				// booked rooms
				$booked = 0;
			
				$availarr = array_values($conf[$key]['info']);
				$baseavail = $availarr[0];
			
				if (isset($this->_bookings) && !empty($this->_bookings)) {
					if (isset($this->_bookings[$key])) {
						if (isset($this->_bookings[$key][$date])) {
							if (isset($this->_bookings[$key][$date]["rooms"])) {
								$booked = $this->_bookings[$key][$date]["rooms"];
							}
						}
					}
				}
			
				$currentavail = $baseavail - $booked;
				
				if($currentavail >= $roomsreq) {
					$canbebooked["s"] = true;
					$booking[$key][$date]["rooms"] = $roomsreq;
				} else {
					$canbebooked["s"] = false;
					$canbebooked["d"] = $roomsreq - $currentavail;
				}
			}
		}
		
		
		// Now book the room
		if ($canbebooked) {
			$this->_bookings = $booking;
			$response['s'] = "1";
			$response['msg'] = "Successfully booked required rooms";
			$response["bookings"] = $booking;
			$param['client']->send(json_encode($response));
			
		} else {
			$shrotage = $canbebooked['d'];
			$response['s'] = "0";
			$response['msg'] = "Cannot Book. Falling short of {$shortage} rooms";
			$param['client']->send(json_encode($response));
		}
		
		
	}
	
	
	// log msgs 
	function say($msg, $priority="info") {
		$date = date('Y-m-d H:i:s');
		printf("[SOCKET][%s](%s) %s%s", $priority, $date, $msg, PHP_EOL);
	}
}