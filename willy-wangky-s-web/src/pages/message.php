<!DOCTYPE html>
<html>
    <head>
        <title><?php if (isset($message_title)) {echo $message_title.' - ';}?>Choco Shop</title>
        <link rel="stylesheet" href="/static/css/header.css">
        <link rel="stylesheet" href="/static/css/rizky.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <?php include __DIR__.'/../components/header.php' ?>
      <div id="container">
        <?php if (isset($message_title)) {echo '<h1>'.$message_title.'</h1>';} ?>
        <?php if (isset($message_content)) {echo '<p>'.$message_content.'</p>';} ?>
      </div>
      <script src="/static/js/responsive.js"></script>
    </body>
</html>