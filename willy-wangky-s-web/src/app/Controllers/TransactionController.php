<?php

namespace App\Controllers;

class TransactionController extends Controller
{
    # return user transactions
    public function get_user_transactions() {
        $user_info = $this->check_auth();
        
        $user_id = $user_info['id'];
        $offset = array_key_exists('count', $_GET) ? $_GET['offset'] : 0;
        $count = array_key_exists('count', $_GET) ? $_GET['count'] : 1;

        $res2 = \DatabaseConnection::prepare_query('
            SELECT * FROM transaction JOIN chocolate ON (transaction.chocolate = chocolate.id) WHERE user_id = ? ORDER BY transaction_date DESC, transaction_time DESC LIMIT ?, ?;
        ');
        $res2->bind_param('iii', $user_id, $offset, $count);

        if ($res2->execute()) {
            $data = $res2->get_result()->fetch_all(MYSQLI_ASSOC);
            $res2->free_result();
            return $this->respondSuccess('Success', $data, 200);
        } else {
            return $this->respondErrorCode('Query failed to execute', 500);
        }
    }

    # return how many transactions does a user have
    public function get_user_transaction_count() {
        $user_info = $this->check_auth();
        $res = \DatabaseConnection::execute_query('SELECT count(*) AS count FROM transaction WHERE user_id = '.$user_info['id'].';');
        if ($res === false) {
            return $this->respondError('Database on server is not properly setup?', null, 500);
        }
        return $this->respondSuccess('Success', $res[0]['count'], 200);
    }
}
