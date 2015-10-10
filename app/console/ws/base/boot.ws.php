<?php 
/**
 * Boot class file for websocket implementation
 */


use Wrench\Application\Application;

// Include files requires for booting the websocket server
// require_once __DIR__ . '/base/core.ws.php';


class HookerApp extends Application {
	
	// global variables
	private $_clients = array();
	
	
	/**
	 * Constructor for class
	 */
	function __construct() {
		
	}
	
	
	/**
	 * Perform on connect of client
	 * @param Connection $client
	 */
	public function onConnect($client) {
		$id = $client->getId();
		$this->_clients[$id] = $client;
	}
	
	/**
	 *  Perform on disconnect of client
	 * @param Connection $client
	 */
	public function onDisconnect($client) {

	}
	
	/**
	 * Perform on data actions
	 * (non-PHPdoc)
	 * @see \Wrench\Application\Application::onData()
	 */
	public function onData($data, $user) {	

	}
	
	
	/**
	 * Method to say on console
	 * @param unknown $msg
	 * @param string $priority
	 */
	function say($msg, $priority="info") {
		$date = date('Y-m-d H:i:s');
		printf("[SOCKET][%s](%s) %s%s", $priority, $date, $msg, PHP_EOL);
	}
}

