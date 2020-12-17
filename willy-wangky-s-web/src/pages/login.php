<!DOCTYPE html>
<html>
    <head>
        <title>Login - Choco Shop</title>
        <link rel="stylesheet" type="text/css" href="static/css/form.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="container">
            <div id="form-container">
                <div id="form-title">
                    <h1>Willy Wangky Choco Factory</h1>
                </div>
                <form id="form-box" onsubmit="callLogin(event)">
                    <label class="form-input-label" for="email">Email</label><br>
                    <div class="form-input-box-container">
                        <input class="form-input-box" type="email" id="email" name="email" required>
                        <span class="form-input-box-dummy"></span>
                    </div>
                    <label class="form-input-label" for="password">Password</label><br>
                    <div class="form-input-box-container">
                        <input class="form-input-box" type="password" id="password" name="password" required>
                        <span class="form-input-box-dummy"></span>
                    </div>
                    <br>
                    <input class="form-input-submit" type="submit" value="login">
                    <input class="form-redirect-button" onclick="goRegister()" type="button" value="or register...">
                    <ul id="form-error-box"></ul>
                </form>
            </div>
        </div>
        <script src="static/js/login.js"></script>
    </body>
</html>