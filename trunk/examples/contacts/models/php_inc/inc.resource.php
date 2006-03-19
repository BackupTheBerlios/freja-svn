<?php
$request_headers = apache_request_headers();
if (isset($request_headers['Http-Method-Equivalent'])) {
	$REQUEST_METHOD = $request_headers['Http-Method-Equivalent'];
} else {
	$REQUEST_METHOD = $_SERVER['REQUEST_METHOD'];
}

if ($REQUEST_METHOD == "PUT" || $REQUEST_METHOD == "POST") {
	$RAW = file_get_contents('php://input');
	$parser = new XML_Unserializer();
	$PAYLOAD = $parser->unserialize($RAW);
}

//error_log($REQUEST_METHOD."\n", 3, dirname(__FILE__)."/access.log");

switch ($REQUEST_METHOD) {
	case 'GET':
		$row = $model->fetchByPK(@$_GET[$model->pkey]);
		if (is_null($row)) {
			header("HTTP/1.0 404 Not Found");
			exit;
		}
		header("Content-Type:text/xml");
		echo "<?xml version='1.0' ?".">";
		$row['url'] = url($_SERVER['PHP_SELF'], Array($model->pkey => $row[$model->pkey]));
		echo xml_serialize('record', $row);
	exit;
	case 'PUT':
		$row = $model->fetchByPK(@$_GET[$model->pkey]);
		if (!is_null($row)) {
			header("HTTP/1.0 409 Conflict");
			exit;
		}
		if (!$model->insert($PAYLOAD)) {
			trigger_error("Failed to insert");
			exit;
		}
//		header("HTTP/1.0 201 Created");
		header("HTTP/1.0 200 OK");
	exit;
	case 'POST':
		$row = $model->fetchByPK(@$_GET[$model->pkey]);
		if (is_null($row)) {
			header("HTTP/1.0 404 Not Found");
			exit;
		}
		$pkey = $model->update($PAYLOAD, $_GET);
		if (!$pkey) {
			trigger_error("Failed to update");
			exit;
		}
		header("HTTP/1.0 200 OK");
	exit;
	case 'DELETE':
		$row = $model->fetchByPK(@$_GET[$model->pkey]);
		if (is_null($row)) {
			header("HTTP/1.0 404 Not Found");
			exit;
		}
		if (!$model->deleteByPK(@$_GET[$model->pkey])) {
			trigger_error("Failed to delete");
			exit;
		}
		header("Content-Type:text/xml");
		echo "<?xml version='1.0' ?".">";
		echo xml_serialize('result', Array('status' => "ok"));
	exit;
	default:
			trigger_error("Unrecognized request-method: " . $REQUEST_METHOD);
	exit;
}
?>