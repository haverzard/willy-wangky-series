<!DOCTYPE html>
<html>
    <head>
        <title>Register - Choco Shop</title>
        <link rel="stylesheet" href="static/css/form.css">
        <link rel="icon" href="/static/images/favicon.png">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="container">
            <div id="form-container">
                <div id="form-title">
                    <h1>Willy Wangky Choco Factory</h1>
                </div>
                <form id="form-box" onsubmit="callRegister(event)">
                    <label class="form-input-label" for="username">Email</label><br>
                    <div class="form-input-box-container">
                        <input class="form-input-box" onkeyup="checkEmail()" type="email" id="email" name="email"
                            maxlength="99"
                            required>
                        <span class="form-input-box-dummy"></span>
                    </div>
                    <label class="form-input-label" for="username">Username</label><br>
                    <div class="form-input-box-container">
                        <input class="form-input-box" onkeyup="checkUsername()" type="text" id="username" name="username" pattern="[A-Za-z0-9_]+" 
                            maxlength="99"
                            title="Username must contains alphanumberic and underscores only" required>
                        <span class="form-input-box-dummy"></span>
                    </div>
                    <label class="form-input-label" for="password">Password</label><br>
                    <div class="form-input-box-container">
                        <input class="form-input-box" onkeyup="checkPassword()" type="password" id="password" name="password"
                            maxlength="99"
                            required>
                        <span class="form-input-box-dummy"></span>
                    </div>
                    <label class="form-input-label" for="password">Confirm Password</label><br>
                    <div class="form-input-box-container">
                        <input class="form-input-box" onkeyup="checkPassword()" id="confirm_password" type="password">
                        <span class="form-input-box-dummy"></span>
                    </div>
                    <br>
                    <input class="form-input-submit" type="submit" value="register">
                    <input class="form-redirect-button" onclick="goLogin()" type="button" value="or login...">
                    <ul id="form-error-box"></ul>
                </form>
            </div>
        </div>
        <script src="static/js/register.js">
        </script>
    </body>
</html>