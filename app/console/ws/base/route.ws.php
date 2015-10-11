<?php 

class RouteManager {
	protected $_core;
	
	
	function __construct() {
		$this->_core = new Core();
	}

	/**
	 * Perform route task
	 * @param unknown_type $params
	 */
	public function perform($param) {
		$this->route($param);
	}
		
	/**
	 * Method to route all tasks and actions here
	 * @param unknown $params
	 */
	public function route($param) {
		switch ($param["t"]) {
			case "search"  : $this->search($param);  break;
			case "book"    : $this->book($param);  break;			
		}
	}
	
	/**
	 * Method to route search task
	 * @param unknown_type $param
	 */
	public function search($param) {
		$this->_core->search($param);
	}
	
	/**
	 * Method to book rooms
	 * @param unknown_type $param
	 */
	public function book($param) {
		$this->_core->book($param);		
	}
	
	
}