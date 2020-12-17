<?php

header("Access-Control-Allow-Origin: *");

require_once __DIR__.'/../bootstrap/app.php';

require_once __DIR__.'/../app/Controllers/Controller.php';
require_once __DIR__.'/../app/Controllers/UserController.php';
require_once __DIR__.'/../app/Controllers/ChocolateController.php';
require_once __DIR__.'/../app/Controllers/PageController.php';
require_once __DIR__.'/../app/Controllers/TransactionController.php';

Router::run();
