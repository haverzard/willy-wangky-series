<?php

namespace App\Controllers;

use SimpleXMLElement;

class Controller
{
    /**
     * @param bool $check_su
     * @return array|null
     */
    public function check_auth($check_su=false) {
        if (empty($_COOKIE['CHOCO_SESSION'])) {
            header('Location: /login');
            exit();
        }
        $res = \DatabaseConnection::prepare_query('SELECT * FROM user WHERE access_token = BINARY ? and token_creation_time > DATE_SUB(now(), INTERVAL 1 HOUR);');
        $res->bind_param('s', $_COOKIE['CHOCO_SESSION']);
        $res->execute();
        $res = $res->get_result()->fetch_assoc();
        if ($check_su && !$res['is_superuser']) {
            header('Location: /');
            exit();
        }
        if (!$res) {
            header('Location: /login');
            exit();
        }
        return $res;
    }

    /**
     * @param array $data
     * @param int $statusCode
     * @return false|string
     */
    public function respondJson(array $data, $statusCode=200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        return json_encode($data);
    }

    /**
     * @param $message
     * @param null $data
     * @param int $statusCode
     * @return false|string
     */
    public function respondSuccess($message, $data=null, $statusCode=200) {
        return $this->respondJson([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * @param $message
     * @param $statusCode
     * @return false|string
     */
    public function respondSuccessCode($message, $statusCode) {
        return $this->respondSuccess($message, null, $statusCode);
    }

    /**
     * @param $message
     * @param null $data
     * @param int $statusCode
     * @return false|string
     */
    public function respondError($message, $data=null, $statusCode=400) {
        return $this->respondJson([
            'success' => false,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * @param $message
     * @param $statusCode
     * @return false|string
     */
    public function respondErrorCode($message, $statusCode) {
        return $this->respondError($message, null, $statusCode);
    }

    function fetch($method, $url, $data=false, $header=null) {
        $curl = curl_init();

        switch ($method) {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);
                if ($data) curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                break;
            default:
                if ($data) $url = sprintf("%s?%s", $url, http_build_query($data));
        }

        if ($header) {
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        }

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);
        $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        return array("result"=>$result, "code"=>$code);
    }

    function createEnvelope($function, $argsArr) {
      $args = '';
      foreach ($argsArr as $key => $value) {
          $args .= '<'.$key.'>'.$value.'</'.$key.'>';
      }
      return '<x:Envelope
        xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:ser="http://interfaces.services.ws.factory.tubes.wbd.com/">
        <x:Header/>
        <x:Body>
        <ser:'.$function.'>
        '.$args.'
        </ser:'.$function.'>
        </x:Body>
      </x:Envelope>';
    }

    function callFactoryWS($path, $function, $argsArr) {
        $payload = $this->createEnvelope($function, $argsArr);
        $header = [
            'Content-Type: text/xml',
            'WSF-APITOKEN: INI_TOKEN_API_NYA_OKEE',
        ];
        $res = $this->fetch('POST', getenv('WSFACTORY_ENDPOINT').$path.'?wsdl', $payload, $header);
        if ($res['code'] == 200) {
            return new SimpleXMLElement($res['result']);
        } else {
            return $res['code'];
        }
    }
}
