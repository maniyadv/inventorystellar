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
			$conf[$val]['info']  = array(date('Y-m-d') => ''.rand(100, 1000));
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
		
		/* if ($param["type"] == "manual") {
						
			$hotels = $this->findAvailableHotels($param);
						
			$response["s"] = "1";
			$response["d"] = $hotels;
			$param["client"]->send(json_encode($response));
		} */

	}
	
	/**
	 * Method to find available hotels
	 * @param unknown_type $param
	 */
	public function findAvailableHotels($param) {
		$roomsreq = $param["rooms"];
		$checkin  = $param["checkin"];
		$checkout = $param["checkout"];
		
		$conf = $this->_coreconfig;
		
		foreach ($conf as $key => $val){
			
		} 
	}
}