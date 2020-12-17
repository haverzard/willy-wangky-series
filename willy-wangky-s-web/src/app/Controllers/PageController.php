<?php

namespace App\Controllers;

use SimpleXMLElement;

class PageController extends Controller
{
    public function check_pending_add_stock_requests() {        
        // check db for pending requests
        $check_requests = \DatabaseConnection::execute_query("SELECT * FROM pending_add_stock_request;");
        if (!$check_requests) {
            return;
        }
        
        // for each pending request
        foreach($check_requests as $check_request) {
            // check WS Factory
            $check_xmlres = $this->callFactoryWS(
                '/add-stock-request', 
                'getAddStockRequest', 
                ['id' => $check_request['id']]
            );

            if (!is_int($check_xmlres)) {
                $check_request_status = $check_xmlres->xpath('//return')[0];
                
                // if status == delivered, update stock and remove from pending list
                if ($check_request_status->status == "delivered") {
                    $res1 = \DatabaseConnection::execute_query("UPDATE chocolate SET stock = stock + ".$check_request_status->amountToAdd." WHERE id = ".$check_request_status->chocolateId.";");
                    $res2 = \DatabaseConnection::execute_query("DELETE FROM pending_add_stock_request WHERE id = ".$check_request['id'].";");
                }
            }
        }
    }

    public function login_page() {
        $this->check_pending_add_stock_requests();
        include("../pages/login.php");
    }

    public function register_page() {
        $this->check_pending_add_stock_requests();
        include("../pages/register.php");
    }

    public function dashboard_page() {
        $this->check_pending_add_stock_requests();
        $user_info = $this->check_auth();
        $chocolates = \DatabaseConnection::execute_query("SELECT * FROM chocolate ORDER BY sold DESC LIMIT 10;");
        include("../pages/dashboard.php");
    }

    public function add_chocolate_page() {
        $this->check_pending_add_stock_requests();
        $user_info = $this->check_auth(true);
        $res = $this->fetch("GET", getenv("WSSUPPLIER_ENDPOINT")."/materials");
        // $res = array("result"=>'[{"id": 1, "name": "lorem ipsum lorem ipsum lorem ipsum", "price": 1000}]', "code"=>200);
        include("../pages/add_chocolate.php");
    }

    public function transaction_history_page() {
        $this->check_pending_add_stock_requests();
        $user_info = $this->check_auth();
        $transactions = \DatabaseConnection::execute_query("SELECT c.id AS id, name, amount, total_price, transaction_date, transaction_time, address FROM transaction t INNER JOIN chocolate c ON t.chocolate = c.id WHERE user_id = ".$user_info['id'].";");
        include("../pages/transaction_history.php");
    }

    public function search_page() {
        $this->check_pending_add_stock_requests();
        // check user role
        $user_info = $this->check_auth();

        // fetch data
        $res = \DatabaseConnection::prepare_query('SELECT COUNT(*) as total FROM chocolate WHERE name LIKE CONCAT("%",?,"%");');
        $res->bind_param('s', $_GET['name']);
        $res->execute();
        $total_pages = ceil($res->get_result()->fetch_assoc()['total'] / 10);

        // show page
        include("../pages/search.php");
    }

    public function detail_chocolate_page() {
        $this->check_pending_add_stock_requests();
        $user_info = $this->check_auth(false);
        $path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $arr = explode('/', rtrim($path, '/'));
        $id = end($arr);
        $res = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE id = ?;');
        $res->bind_param('i', $id);
        $res->execute();
        $chocolates = $res->get_result()->fetch_all(MYSQLI_ASSOC);
        if (empty($chocolates)) {
            $not_found_message = '404 Chocolate not found';
            include("../pages/404.php");
        } else {
            $chocolate = $chocolates[0];
            include("../pages/detail_chocolate.php");
        }
    }

    public function add_stock_chocolate_page() {
        $this->check_pending_add_stock_requests();
        // check user role
        $user_info = $this->check_auth(true);

        // get chocolate
        $path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $arr = explode('/', rtrim($path, '/'));
        $id = $arr[count($arr) - 2];
        $res = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE id = ?;');
        $res->bind_param('i', $id);
        $res->execute();
        $chocolates = $res->get_result()->fetch_all(MYSQLI_ASSOC);

        // show page
        if (empty($chocolates)) {
            $not_found_message = '404 Chocolate not found';
            include("../pages/404.php");
        } else {
            $chocolate = $chocolates[0];
            include("../pages/add_stock_chocolate.php");
        }
    }

    public function buy_chocolate_page() {
        $this->check_pending_add_stock_requests();
        // check user role
        $user_info = $this->check_auth(false);

        // get chocolate
        $path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $arr = explode('/', rtrim($path, '/'));
        $id = $arr[count($arr) - 2];
        $res = \DatabaseConnection::prepare_query('SELECT * FROM chocolate WHERE id = ?;');
        $res->bind_param('i', $id);
        $res->execute();
        $chocolates = $res->get_result()->fetch_all(MYSQLI_ASSOC);

        // show page
        if (empty($chocolates)) {
            $not_found_message = '404 Chocolate not found';
            include("../pages/404.php");
        } else {
            $chocolate = $chocolates[0];
            include("../pages/buy_chocolate.php");
        }
    }
}
