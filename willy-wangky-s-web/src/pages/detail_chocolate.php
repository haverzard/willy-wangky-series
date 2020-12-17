<!DOCTYPE html>
<html>
    <head>
        <title>Detail - Choco Shop</title>
        <link rel="stylesheet" href="/static/css/header.css">
        <link rel="stylesheet" href="/static/css/detail_chocolate.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <?php $nav_page = ''; include __DIR__.'/../components/header.php'; ?>
        <div id="container">
            <div id="chocolate-detail-container">
                <?php
                    echo '
                        <div class="chocolate-detail-name">
                            <h2>'.$chocolate['name'].'</h2>
                        </div>
                        <div class="chocolate-detail-body">
                            <div class="chocolate-detail-img">
                                <img class="chocolate-detail-img"
                                    src="/static/images/chocolates/chocolate_'
                                    .$chocolate['id'].'.'.$chocolate['image_file_type'].'"
                                    onerror="this.onerror=null; this.src=\'/static/images/chocolates/default_choco.jpg\'"
                                    alt="'.$chocolate['name'].'">
                            </div>
                            <div class="chocolate-detail-desc">
                                <ul>
                                    <li><span class="label-form">Amount sold      : </span><span id="sold">'.$chocolate['sold'].'</span></li>
                                    <li><span class="label-form">Price            : </span>Rp '.$chocolate['price'].',00</li>
                                    <li><span class="label-form">Amount           : </span><span id="stock">'.$chocolate['stock'].'</span></li>
                                    <li><span class="label-form">Description      : </span><br>'.$chocolate['description'].'</li>
                                </ul>
                            </div>
                        </div>                
                    ';
                    echo '<div class="chocolate-detail-option">';
                    if ($user_info['is_superuser']) {
                        echo '<a class="chocolate-detail-btn" href="/detail_chocolate/'.$id.'/add">Add Stock</a>';
                    } else {
                        if ((int) $chocolate['stock'] > 0)
                            echo '<a class="chocolate-detail-btn" href="/detail_chocolate/'.$id.'/buy">Buy Now</a>';
                    }
                    echo '</div>';
                ?>
            </div>
        </div>
        <script src="/static/js/helper.js"></script>
        <script src="/static/js/responsive.js"></script>
        <script src="/static/js/choco_detail_updater.js"></script>
        <script src="/static/js/detail_chocolate.js"></script>
    </body>
</html>
