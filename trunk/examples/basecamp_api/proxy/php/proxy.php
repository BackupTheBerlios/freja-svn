<?php

	$login    = "freja";
	$password = "apitest";
	$baseUrl  = "http://freja.projectpath.com/";

	$HTTPMethod      = $_SERVER['REQUEST_METHOD'];
	$HTTPRequestUrl  = urldecode($_REQUEST['url']);		
	$HTTPRawPostData = file_get_contents("php://input");
	include('Request.php');

	// safety check, only request legit url
	if(strpos($HTTPRequestUrl,$baseUrl)===0) {

		$req = &new HTTP_Request($HTTPRequestUrl);
		$req->setBasicAuth($login,$password);
		$req->setMethod($HTTPMethod);
		$req->addHeader('Content-Type','application/xml');
		$req->addHeader('Accept','application/xml');
		if($HTTPRawPostData) {
			$req->_body = $HTTPRawPostData;
		}
		$req->sendRequest();

		$response = $req->getResponseBody();
		$code     = $req->getResponseCode();

		switch($code) {
			case 200:
				header("HTTP/1.0 200 Ok");
				break;
			case 201:
				header("HTTP/1.0 201 Created");
				break;
			case 404:
				header("HTTP/1.0 404 Not Found");
				die(" 404 Not Found -".$response);				
			default:
				header("HTTP/1.0 502 Bad Gateway");
				die("Bad Gateway - ".$code." ".$response." # ".$HTTPRequestUrl." # ".$req->_body);
		}
		header('Content-Type: text/xml');
		echo $response;
	}
	else {
		header("HTTP/1.0 403 Forbidden");
		echo "Requested url not allowed.";
	}
?>
