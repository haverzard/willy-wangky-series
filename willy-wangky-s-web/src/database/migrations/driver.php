<?php

if (file_exists(__DIR__.'/../../bootstrap/env.php'))
    include __DIR__.'/../../bootstrap/env.php';

require_once __DIR__.'/MigrateDatabase.php';

require_once __DIR__.'/CreateUserTable.php';
require_once __DIR__.'/CreateChocolateTable.php';
require_once __DIR__.'/CreateTransactionTable.php';
require_once __DIR__.'/CreatePendingAddStockRequestTable.php';

MigrateDatabase::up();
