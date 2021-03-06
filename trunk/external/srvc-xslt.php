<?php
	// XSL Transformation Service for Freja
	// PHP4.0 Version 1.0


	function error_handler($errno, $errstr, $errfile, $errline) {
		if (error_reporting() == 0) {
			return;
		}
		$filename = "log.txt";
		if (!is_file($filename)) {
			@fclose(fopen($filename, "w"));
		}
		error_log($errstr."\n", 3, $filename);
		header("HTTP/1.0 500 Internal Error");
		header('Content-Type: text/plain; charset="UTF-8"');
		echo "Error: ".$errstr;
		exit;
	}
	function exception_handler($ex) {
		error_handler($ex->getCode(), $ex->getMessage(), $ex->getFile(), $ex->getLine());
	}
	set_error_handler('error_handler');
	if (function_exists('set_exception_handler')) {
		set_exception_handler('exception_handler');
	}

	if (isset($_POST['xmlData']) && isset($_POST['xslFile'])) {
		$root = realpath(dirname(__FILE__)."/../");
		$xmlData = stripslashes($_POST['xmlData']);
		$path = isset($_GET['path']) ? ("/".stripslashes($_GET['path'])) : "";
		$xslFile = $root.$path."/".stripslashes($_POST['xslFile']);

		if (!preg_match("/^".preg_quote(realpath($root), "/")."/", realpath($xslFile))) {
			trigger_error("Illegal filename '$xslFile'");
		}
		$arrXslParam = array();

		if (isset($_POST['xslParam'])) {
			$xslParam = $_POST['xslParam'];   // encoded as param_name1,value1,param_name2,value2
			$arrXsl   = split(",",$xslParam);
			for ($i=0;$i<count($arrXsl);$i+=2) {
				$arrXslParam[$arrXsl[$i]] = $arrXsl[$i+1];
			}
		}
		$xmlDoc = domxml_open_mem($xmlData, DOMXML_LOAD_DONT_KEEP_BLANKS);
		if ($xmlDoc) {
			$xslDoc = domxml_xslt_stylesheet_file($xslFile);
			if (!$xslDoc) {
				trigger_error("XSL_TRANSFORMATION: Load XSL failed. File path was: $xslFile.\n");
			}
			$transformedData = $xslDoc->process($xmlDoc, $arrXslParam);
			if (!$transformedData) {
				trigger_error("XSL_TRANSFORMATION: Transformation failed.\n");
			}
			$xhtmlOuput = str_replace('<?xml version="1.0"?>','',$xslDoc->result_dump_mem($transformedData));

			header("HTTP/1.0 200 Ok");
			header('Content-Type: text/xml, charset="UTF-8"');
			echo $xhtmlOuput;

		} else {
			trigger_error("XSL_TRANSFORMATION: Parsing Error. Data was: $xmlData.\n");
		}
	}
	else {
		trigger_error("XSL_TRANSFORMATION: Bad Request.");
	}
?>