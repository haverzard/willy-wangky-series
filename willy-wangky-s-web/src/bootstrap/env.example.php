<?php

$envs = [
    'APP_NAME' => 'WillyWangkyWebsite',

    'DB_HOST' => '127.0.0.1',
    'DB_PORT' => '3306',
    'DB_DATABASE' => 'mysql_database_name',
    'DB_USERNAME' => 'mysql_username',
    'DB_PASSWORD' => 'mysql_password',

    'WSFACTORY_ENDPOINT' => 'http://localhost:8080/wsfactory-1.0-SNAPSHOT',
    'WSSUPPLIER_ENDPOINT' => 'http://localhost:3030',
];

foreach ($envs as $key => $value)
    putenv(sprintf('%s=%s', $key, $value));
