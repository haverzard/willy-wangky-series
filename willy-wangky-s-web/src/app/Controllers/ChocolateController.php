<?php

namespace App\Controllers;

use SimpleXMLElement;

class ChocolateController extends Controller
{
    public function show_top_selling_chocolates() {
        $res = \DatabaseConnection::execute_query('SELECT * FROM chocolate ORDER BY sold DESC LIMIT 10;');
        if ($res === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        }
        return $this->respondSuccess('Success', $res, 200);
    }

    public function id_lookup() {
        // get choco id
        $path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $arr = explode('/', rtrim($path, '/'));
        $id = $arr[count($arr) - 1];

        // exec query
        $res = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE id = ?;');
        $res->bind_param('i', $id);
        $res->execute();
        $res = $res->get_result()->fetch_assoc();

        // return
        if ($res === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        } else if (!$res) {
            return $this->respondError('Chocolate Not Found', null, 404);
        }
        return $this->respondSuccess('Success', $res, 200);
    }

    public function find_chocolates() {
        if (empty($_GET['page']) || !ctype_digit(strval($_GET['page']))) {
            return $this->respondError('Please enter a correct page number', null, 400);
        }
        $offset = ($_GET['page']-1)*10;
        $res = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE name LIKE CONCAT("%",?,"%") LIMIT ?, 10;');
        $res->bind_param('si', $_GET['name'], $offset);
        $res->execute();
        $res = $res->get_result()->fetch_all(MYSQLI_ASSOC);
        if ($res === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        }
        return $this->respondSuccess('Success', $res, 200);
    }

    public function add_chocolate() {
        if (empty($_POST['materials'])) {
            return $this->respondError('Please enter a material', null, 400);
        }
        $materials = array();
        foreach($_POST['materials'] as $id=>$amount) {
            if ($amount) {
                if (!ctype_digit(strval($amount)) || $amount < 0) {
                    return $this->respondError('Please enter a correct amount of material', null, 400);
                }
                $res = $this->fetch("GET", getenv("WSSUPPLIER_ENDPOINT")."/materials/".$id);
                if ($res['code'] != 200) {
                    return $this->respondError('Invalid material', null, 400);
                }
                $name = json_decode($res['result'], true)['name'];
                $materials[] = array("id"=>$id, "name"=>$name, "amount"=>$amount);
            }
        }
        if (count($materials) == 0) {
            return $this->respondError('Please enter a material', null, 400);
        }
        if (empty($_POST['price']) || !ctype_digit(strval($_POST['price'])) || $_POST['price'] < 0) {
            return $this->respondError('Please enter a correct price', null, 400);
        }
        $user_info = $this->check_auth(true);
        $res = \DatabaseConnection::prepare_query('INSERT INTO chocolate (name, price, description, image_file_type, stock, sold) VALUES (?, ?, ?, ?, 0, 0);');
        if ($res) {
            if (array_key_exists('image', $_FILES) && ($_FILES['image']['error'] == UPLOAD_ERR_OK)) {
                $tmp = explode('.', basename($_FILES['image']['name']));
                $ext = end($tmp);
                $res->bind_param('siss', $_POST['name'], $_POST['price'], $_POST['description'], $ext);
                if ($res->execute()) {
                    $id = \DatabaseConnection::get_insert_id();
                    $file_name = 'chocolate_' . $id . '.' . $ext;
                    $target_file = __DIR__.'/../../public/static/images/chocolates/'.$file_name;
                    move_uploaded_file($_FILES['image']['tmp_name'], $target_file);

                    // send new chocolate info to WS Factory
                    $xmlres = $this->callFactoryWS(
                        '/chocolate', 
                        'addChocolate', 
                        ['id' => $id, 'name' => $_POST["name"]]
                    );

                    // send recipe info to WS Factory
                    # make Recipe structure
                    $singleRecipes = array();
                    foreach ($materials as $material) {
                        $singleRecipes[$material['id']] = '<chocolateId>'.$id.'</chocolateId>';
                        $singleRecipes[$material['id']] .= '<ingredientId>'.$material['id'].'</ingredientId>';
                        $singleRecipes[$material['id']] .= '<name>'.$material['name'].'</name>';
                        $singleRecipes[$material['id']] .= '<amount>'.$material['amount'].'</amount>';
                    }
                    $recipe = '';
                    foreach ($singleRecipes as $singleRecipe) {
                        $recipe .= '<singleRecipes>'.$singleRecipe.'</singleRecipes>';
                    }
                    # send Recipe
                    $xmlres = $this->callFactoryWS(
                        '/recipe', 
                        'addRecipe', 
                        ['recipe' => $recipe]
                    );

                    if (array_key_exists('soft_return', $_POST)) {
                        $message_title = "Chocolate Added";
                        $message_content = 'You have successfully added a new chocolate: "'.$_POST['name'].'".';
                        include __DIR__.'/../../pages/message.php';
                    } else {
                        return $this->respondSuccessCode('New chocolate added!', 200);
                    }
                } else {
                    return $this->respondErrorCode('Query didnt work!', 500);
                }
            } else {
                return $this->respondErrorCode($_FILES['image']['error'], 400);
            }
        } else {
            return $this->respondErrorCode("Query wasnt prepared!", 500);
        }
    }

    public function add_stock_chocolate() {
        // check auth
        $user_info = $this->check_auth(true);

        // check input
        if (!isset($_POST['amount'])) {
            return $this->respondError('Please enter add stock amount', null, 400);
        }
        if ((int) $_POST['amount'] <= 0) {
            return $this->respondError('Please enter positive add stock amount', null, 400);
        }

        // get choco id
        $path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $arr = explode('/', rtrim($path, '/'));
        $id = $arr[count($arr) - 2];

        // check chocolate
        $res_1 = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE id = ?;');
        $res_1->bind_param('i', $id);
        $res_1->execute();
        $chocolates = $res_1->get_result()->fetch_all(MYSQLI_ASSOC);

        if ($chocolates === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        } else if (!$chocolates) {
            return $this->respondError('Chocolate Not Found', null, 404);
        }

        // send request to WS Factory
        $xmlres = $this->callFactoryWS(
            '/add-stock-request', 
            'addAddStockRequest', 
            ['chocolateId' => $id, 'amountToAdd' => $_POST['amount']]
        );
        
        // mark request as pending
        $id = $xmlres->xpath('//return')[0];
        // NOTE: not using prepare_query, should be fine because its from WS Factory
        $res_2 = \DatabaseConnection::execute_query('INSERT INTO pending_add_stock_request VALUES ('.$id.')');
        if ($res_2 === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        }

        // return
        return $this->respondSuccess('Chocolate stock added successfully', $chocolates[0], 200);
    }

    public function buy_chocolate() {
        // check auth
        $user_info = $this->check_auth();

        // check input
        if (!isset($_POST['amount']) || !isset($_POST['address'])) {
            return $this->respondError('Please enter buy amount and address', null, 400);
        }
        if ((int) $_POST['amount'] <= 0) {
            return $this->respondError('Please enter positive buy amount', null, 400);
        }

        // get choco id
        $path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $arr = explode('/', rtrim($path, '/'));
        $id = $arr[count($arr) - 2];

        // check chocolate
        $res_1 = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE id = ?;');
        $res_1->bind_param('i', $id);
        $res_1->execute();
        $chocolates = $res_1->get_result()->fetch_all(MYSQLI_ASSOC);

        if ($chocolates === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        } else if (!$chocolates) {
            return $this->respondError('Chocolate Not Found', null, 404);
        }

        // check choco stock
        $chocolate = $chocolates[0];
        if ((int) $_POST['amount'] > $chocolate['stock']) {
            return $this->respondError('The chocolate stock is not enough', null, 400);
        }

        // update choco
        $new_stock = (int) $chocolate['stock'] - (int) $_POST['amount'];
        $new_sold = (int) $chocolate['sold'] + (int) $_POST['amount'];
        $res_2 = \DatabaseConnection::prepare_query('UPDATE chocolate SET stock = ?, sold = ? WHERE id = ?;');
        $res_2->bind_param('iii', $new_stock, $new_sold, $id);
        $res_2->execute();

        // create transaction
        $res_3 = \DatabaseConnection::prepare_query('INSERT INTO transaction (user_id, chocolate, amount, total_price, address, transaction_date, transaction_time) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $user_id = (int) $user_info['id'];
        $amount = (int) $_POST['amount'];
        $total_price = (int) $chocolate['price'] * $amount;
        $date = date('Y-m-d');
        $time = date('H:i:s');
        $res_3->bind_param('iiiisss', $user_id, $id, $amount, $total_price, $_POST['address'], $date, $time);
        $res_3->execute();

        // update ws-factory saldo
        $xmlres = $this->callFactoryWS(
            '/saldo', 
            'addSaldo', 
            ['addition' => $total_price]
        );

        // return
        $res_1->execute();
        $chocolates = $res_1->get_result()->fetch_all(MYSQLI_ASSOC);
        if ($chocolates === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        } else if (!$chocolates) {
            return $this->respondError('Chocolate Not Found', null, 404);
        }
        return $this->respondSuccess('Chocolate stock added successfully', $chocolates[0], 200);
    }
}
