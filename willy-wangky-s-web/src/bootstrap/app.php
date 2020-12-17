<?php

// Load environment variables
if (file_exists(__DIR__.'/env.php'))
    include __DIR__.'/env.php';

// Include core module
require_once __DIR__.'/../core/Router.php';
require_once __DIR__.'/../core/DatabaseConnection.php';

// Include routes
require_once __DIR__.'/../routes/api.php';

// Init database connection
DatabaseConnection::init();
