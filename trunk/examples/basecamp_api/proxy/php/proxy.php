<?php
	
	$login    = "freja";
	$password = "apitest";
	$baseUrl  = "http://freja.projectpath.com/";
	
	$HTTPMethod     = $_GET['HTTP_REQUEST_METHOD'];
	$HTTPRequestUrl = $_GET['HTTP_REQUEST_URL'];
	
	include('Request.php');

	// safety check, only request legit url
	if(strpos($HTTPRequestUrl,$baseUrl)===0) {

		$req = &new HTTP_Request($HTTPRequestUrl);
		$req->setBasicAuth($login,$password);
		$req->setMethod($HTTPMethod);	
		$req->addHeader('Content-Type','application/xml');
		$req->addHeader('Accept','application/xml');
		$req->clearPostData();		
		// $req->addPostData('Foo', 'bar');
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
				break;				
		}
		header('Content-Type: text/xml');
		echo $response;
	} 
	else {
		header("HTTP/1.0 403 Forbidden");
		echo "Requested url not allowed.";
	}


?>