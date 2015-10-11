#!/usr/bin/env php
<?php


// Server includes all required files here 
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/base/config.ws.php';
require_once __DIR__ . '/base/boot.ws.php';
require_once __DIR__ . '/base/route.ws.php';
require_once __DIR__ . '/base/core.ws.php';;


// Generate PEM file
$pemFile                = __DIR__ . '/generated.pem';
$pemPassphrase          = null;
$countryName            = "IN";
$stateOrProvinceName    = "Haryana";
$localityName           = "Gurgaon";
$organizationName       = "freeopenproject";
$organizationalUnitName = "usrhash";
$commonName             = "0.0.0.0"; // ip location
$emailAddress           = "sahilmanish@github.com";

/* Wrench\Util\Ssl::generatePEMFile(
$pemFile,
$pemPassphrase,
$countryName,
$stateOrProvinceName,
$localityName,
$organizationName,
$organizationalUnitName,
$commonName,
$emailAddress
); */

// User can use tls in place of ssl
$server = new \Wrench\Server('wss://localhost:8443/', array(
	
		'connection_manager_options' => array(
				'socket_master_options' => array(
						'server_ssl_cert_file'         => __DIR__ . '/new.pem',
						'server_ssl_passphrase'        => "IC4NTM4K3Y0UL0V3",
						'server_ssl_allow_self_signed' => true,
						'server_ssl_verify_peer'       => false
				)
		)
));


$server->registerApplication('invnt', new \HubbleApp());
$server->run();