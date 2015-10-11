#!/usr/bin/env php
<?php

// Server includes all required files here 
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/base/config.ws.php';
require_once __DIR__ . '/base/boot.ws.php';
require_once __DIR__ . '/base/route.ws.php';
require_once __DIR__ . '/base/core.ws.php';


// Initializing the Wrench server
$server = new \Wrench\Server('ws://'.WS_HOST_NAME.':9660/', array(
    'allowed_origins'            => array(
        'usrhash.com'
   ),		
));


$server->registerApplication('invnt', new \HookerApp());
$server->run();
