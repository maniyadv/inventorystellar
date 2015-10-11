<?php 

/**
 * Class to work with core logic 
 * and data manipulation
 * @author
 *
 */



class Core {
	protected $_coreconfig = array();
	
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
			$conf[$val]['avail'] = ''.rand(100, 1000);
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
		
		$response["s"] = "1";
		$response["d"] = $this->_coreconfig;
		$param["client"]->send(json_encode($response));
	}
}