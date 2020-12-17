<!DOCTYPE html>
<html>
    <head>
        <title>Transaction History - Choco Shop</title>
        <link rel="stylesheet" href="/static/css/header.css">
        <link rel="stylesheet" href="/static/css/rizky.css">
        <link rel="stylesheet" href="/static/css/transaction_history.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <?php $nav_page = 'transaction_history'; include __DIR__.'/../components/header.php' ?>
      <div id="container">
        <h1>Transaction History</h1>
        <div class='transaction-per-page'>
          <span>Transaction per Page: </span>
          <select name="transaction_per_page" class='transaction-per-page-select' onchange="update_transaction_per_page()" value="5">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div class='transaction-table-viewer'>
          <div class='transaction-table'>
            <div class='transaction bordered'>
              <a class='transaction-column c1 bold'>Chocolate Name</a>
              <span class='transaction-column c2 bold'>Amount</span>
              <span class='transaction-column c3 bold'>Total Price</span>
              <span class='transaction-column c4 bold'>Date</span>
              <span class='transaction-column c5 bold'>Time</span>
              <span class='transaction-column c6 bold'>Address</span>
            </div>
            <div id='transactions'></div>
          </div>
        </div>
        <div class='transaction-table-controller hidden'>
          <button class='transaction-table-controller-left' onclick="go_left()"><</button>
          <a class='transaction-table-controller-number'></a>
          <button class='transaction-table-controller-right' onclick="go_right()">></button>
        </div>
      </div>
      <script src="/static/js/responsive.js"></script>
      <script src="/static/js/transaction_history.js"></script>
    </body>
</html>