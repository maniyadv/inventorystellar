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
	 * Method to reset all config and booking values
	 * @param unknown_type $param
	 */
	function reset($param) {
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
			$param["checkin"] = $param["cd"];
			$param["checkout"]= $param["cd"];
			
			$response["s"]    = "1";
			$response["t"]    = $param["t"];
			$response["m"]    = "Availability data updated";
			$response["d"]    = $this->findAvailableHotels($param);
			$response["type"] = $param["type"];
			$param["client"]->send(json_encode($response));			
		}
		
		 if ($param["type"] == "manual") {
						
			$response["s"]    = "1";
			$response["t"]    = $param["t"];
			$response["type"] = $param["type"];	
			$response["m"]    = "Search Finished";
			$response["d"]    = $this->findAvailableHotels($param);
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
					if (isset($this->_bookings[$key])) {
						if (isset($this->_bookings[$key][$date])) {
							if (isset($this->_bookings[$key][$date]["rooms"])) {
								$booked = $this->_bookings[$key][$date]["rooms"];
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
		$response    = array();
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
					
					if($booking != 0) {
						$this->_bookings[$key][$date]["rooms"] += $roomsreq;
					} else {
						$this->_bookings = $booking;
					}
					
				} else {
					$canbebooked["s"] = false;
					$canbebooked["d"] = $roomsreq - $currentavail;
				}
			}
		}
		
		
		// Now book the room
		if ($canbebooked["s"]) {			
			$response['s']   = "1";
			$response["t"]   = $param["t"];
			
			if (!isset($param["bot"])) {
				$response['m']   = "Successfully booked required rooms";
			}
			
			$response["bookings"] = $booking;
			$param['client']->send(json_encode($response));
			
		} else {
			$shrotage = $canbebooked['d'];
			$response['s'] = "0";
			$response["t"] = $param["t"];
			
			if (!isset($param["bot"])) {
				$response['m'] = "Cannot Book. Falling short of {$shortage} rooms";								
			}

			$param['client']->send(json_encode($response));
		}
		
		$this->updateAllClients($param);
	}
	
	
	/**
	 * Update all clients about booking if it affects
	 * @param unknown_type $param
	 */
	function updateAllClients($param) {
		foreach ($param["clients"] as $key => $client) {
			$param["t"] = "search";
			$param["type"] = "auto";
			$param["client"] = $client;			
			$this->search($param);			
		}
	}
	
	
	// log msgs 
	function say($msg, $priority="info") {
		$date = date('Y-m-d H:i:s');
		printf("[SOCKET][%s](%s) %s%s", $priority, $date, $msg, PHP_EOL);
	}
}