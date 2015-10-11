<?php 

// Set time zone settings
date_default_timezone_set('Asia/Kolkata');


// Define URL related variables
if (!defined('DS'))                 {
	define('DS', DIRECTORY_SEPARATOR);
}
if (!defined('APP_ROOT'))           {
	define('APP_ROOT', dirname(dirname(__FILE__)));
}
// define host url
if (!defined('HOST_NAME'))           {
	define('HOST_NAME', '192.168.1.9');
}

