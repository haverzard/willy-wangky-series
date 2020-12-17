<!DOCTYPE html>
<html>
    <head>
        <title>Dashboard - Choco Shop</title>
        <link rel="stylesheet" href="static/css/header.css">
        <link rel="stylesheet" href="static/css/dashboard.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <?php $nav_page = 'dashboard'; include __DIR__.'/../components/header.php'; ?>
        <div id="container">
            <div id="welcome">
                <h2>Hello, <?php echo $user_info['username']; ?></h2>
            </div>
            <div id="chocolates-container">
                <?php 
                    if (!$chocolates) {
                        echo 'There is no chocolate to see/buy here.';
                    }
                    foreach ($chocolates as $chocolate) {
                        echo '
                            <div class="chocolate-container" onclick="location.href=\'/detail_chocolate/'.$chocolate['id'].'\';">
                                <div class="chocolate-image">
                                    <img class="chocolate-image"
                                        src="/static/images/chocolates/chocolate_'
                                        .$chocolate['id'].'.'.$chocolate['image_file_type'].'"
                                        onerror="this.onerror=null; this.src=\'/static/images/chocolates/default_choco.jpg\'"
                                        alt="'.$chocolate['name'].'">
                                </div>
                                <div class="chocolate-desc">
                                    <h2>'.$chocolate['name'].'</h2>
                                    <div class="chocolate-info">
                                        <div class="chocolate-info-key">Amount sold</div>
                                        <div class="chocolate-info-value">'.$chocolate['sold'].'</div>
                                    </div>
                                    <div class="chocolate-info">
                                        <div class="chocolate-info-key">Price</div>
                                        <div class="chocolate-info-value">Rp. '.$chocolate['price'].',00</div>
                                    </div>
                                </div>
                            </div>
                        ';
                    }

                ?>
            </div>
        </div>
        <script src="static/js/responsive.js"></script>
    </body>
</html> 
