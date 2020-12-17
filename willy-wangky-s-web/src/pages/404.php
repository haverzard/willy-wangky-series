<!DOCTYPE html>
<html>
    <head>
        <title>Error 404</title>
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="container">
            <?php
                echo '<h1>';
                    if (isset($not_found_message)) {
                        echo $not_found_message;
                    } else {
                        echo '404 Not Found';
                    }
                echo '</h1>';
            ?>
        </div>
        <script src="static/js/responsive.js"></script>
    </body>
</html>
