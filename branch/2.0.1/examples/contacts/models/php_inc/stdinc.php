<?php
class XML_Unserializer
{
	var $stack;
	var $arrOutput;
	var $nullToken = "null";

	function unserialize($strInputXML) {
		$p = xml_parser_create();
		xml_set_element_handler($p, Array(&$this, 'startHandler'), Array(&$this, 'endHandler'));
		xml_set_character_data_handler($p, Array(&$this, 'dataHandler'));
		$this->stack = Array(Array('name' => 'document', 'attributes' => Array(), 'children' => Array(), 'data' => ''));
		if (!xml_parse($p, $strInputXML)) {
			trigger_error(xml_error_string(xml_get_error_code($p))."\n".$strInputXML, E_USER_NOTICE);
			xml_parser_free($p);
			return;
		}
		xml_parser_free($p);

		$tmp = $this->buildArray($this->stack[0]);
		if (count($tmp) == 1) {
			$this->arrOutput = array_pop($tmp);
		} else {
			$this->arrOutput = Array();
		}
		unset($this->stack);
		return $this->arrOutput;
	}

	function getUnserializedData() {
		return $this->arrOutput;
	}

	function buildArray($stack) {
		$result = Array();
		if (count($stack['attributes']) > 0) {
			$result = array_merge($result, $stack['attributes']);
		}

		if (count($stack['children']) > 0) {
			if (count($stack['children']) == 1) {
				$key = array_keys($stack['children']);
				if ($stack['children'][$key[0]]['name'] === $this->nullToken) {
					return NULL;
				}
			}
			$keycount = Array();
			foreach ($stack['children'] as $child) {
				$keycount[] = $child['name'];
			}
			if (count(array_unique($keycount)) != count($keycount)) {
				// enumerated array
				$children = Array();
				foreach ($stack['children'] as $child) {
					$children[] = $this->buildArray($child);
				}
			} else {
				// indexed array
				$children = Array();
				foreach ($stack['children'] as $child) {
					$children[$child['name']] = $this->buildArray($child);
				}
			}
			$result = array_merge($result, $children);
		}

		if (count($result) == 0) {
			return trim($stack['data']);
		} else {
			return $result;
		}
	}

	function startHandler($parser, $name, $attribs = Array()) {
		$token = Array();
		$token['name'] = strtolower($name);
		$token['attributes'] = $attribs;
		$token['data'] = "";
		$token['children'] = Array();
		$this->stack[] = $token;
	}

	function endHandler($parser, $name, $attribs = Array()) {
		$token = array_pop($this->stack);
		$this->stack[count($this->stack) - 1]['children'][] = $token;
	}

	function dataHandler($parser, $data) {
		$this->stack[count($this->stack) - 1]['data'] .= $data;
	}
}

class TableGateway
{
	var $table;
	var $pkey;

	function getColumns() {
		$columns = Array();
		$result = mysql_query("SHOW COLUMNS FROM `".$this->table."`") or trigger_error(mysql_error());
		if (mysql_num_rows($result) == 0) {
			trigger_error("No table information available", E_USER_ERROR);
		}
		while ($row = mysql_fetch_array($result)) {
			$columns[] = $row[0];
		}
		mysql_free_result($result);
		return $columns;
	}

	function fetchByPK($pkey) {
		return $this->fetch(Array($this->pkey => $pkey));
	}

	function deleteByPK($pkey) {
		return $this->delete(Array($this->pkey => $pkey));
	}

	function fetch($condition) {
		$query = "SELECT * FROM `".$this->table."`";
		$where = Array();
		foreach ($condition as $column => $value) {
			$where[] = "`".$column."`='".mysql_escape_string($value)."'";
		}
		if (count($where) == 0) {
			trigger_error("No conditions given for fetch", E_USER_WARNING);
		}
		$query .= " WHERE ".implode(" AND ", $where);
		$query .= " LIMIT 1";
		$result = mysql_query($query) or trigger_error(mysql_error());
		if (mysql_num_rows($result) != 1) {
			return NULL;
		}
		$row = mysql_fetch_assoc($result);
		mysql_free_result($result);
		return $row;
	}

	function select($orderby = NULL, $direction = NULL, $limit = NULL, $offset = NULL) {
		$query = "SELECT `".$this->pkey."` FROM `".$this->table."`";
		if (!is_null($orderby)) {
			$query .= " ORDER BY `".mysql_escape_string($orderby)."`";
		}
		if (!is_null($direction)) {
			$query .= (strtolower($direction) == 'asc') ? 'ASC' : 'DESC';
		}
		if (!is_null($limit)) {
			$query .= "LIMIT ".((int) $limit);
			if (!is_null($offset)) {
				$query .= ",".((int) $offset);
			}
		}
		$result = mysql_query($query) or trigger_error(mysql_error());
		$resultset = Array();
		while ($row = mysql_fetch_assoc($result)) {
			$resultset[] = $row;
		}
		mysql_free_result($result);
		return $resultset;
	}

	function insert($data) {
		$query = "INSERT INTO `".$this->table."`";
		$values = Array();
		foreach ($this->getColumns() as $column) {
			if (isset($data[$column])) {
				$values[] = "`".$column."`='".mysql_escape_string($data[$column])."'";
			}
		}
		$query .= " SET ".implode(",", $values);
		mysql_query($query) or trigger_error(mysql_error());
		return TRUE;
	}

	function update($data, $condition) {
		$query = "UPDATE `".$this->table."`";
		$values = Array();
		foreach ($this->getColumns() as $column) {
			if (isset($data[$column])) {
				$values[] = "`".$column."`='".mysql_escape_string($data[$column])."'";
			}
		}
		$query .= " SET ".implode(",", $values);
		$where = Array();
		foreach ($this->getColumns() as $column) {
			if (isset($condition[$column])) {
				$where[] = "`".$column."`='".mysql_escape_string($condition[$column])."'";
			}
		}
		if (count($where) == 0) {
			trigger_error("No conditions given for delete", E_USER_WARNING);
		}
		$query .= " WHERE ".implode(" AND ", $where);
		$query .= " LIMIT 1";
		mysql_query($query) or trigger_error(mysql_error());
		return TRUE;
	}

	function delete($condition) {
		$query = "DELETE FROM `".$this->table."`";
		$where = Array();
		foreach ($this->getColumns() as $column) {
			if (isset($condition[$column])) {
				$where[] = "`".$column."`='".mysql_escape_string($condition[$column])."'";
			}
		}
		if (count($where) == 0) {
			trigger_error("No conditions given for delete", E_USER_WARNING);
		}
		$query .= " WHERE ".implode(" AND ", $where);
		$query .= " LIMIT 1";
		mysql_query($query) or trigger_error(mysql_error());
		return mysql_affected_rows() == 1;
	}
}

function xml_serialize($tagname, $data) {
	$xml = "<$tagname>";
	if (is_array($data)) {
		foreach ($data as $key => $value) {
			$xml .= xml_serialize($key, $value);
		}
	} else {
		$xml .= "<![CDATA[".$data."]]>";
	}
	$xml .= "</$tagname>\n";
	return $xml;
}

function json_serialize($values) {
	$pairs = Array();
	foreach ($values as $key => $value) {
		$pairs[] = "'".addslashes($key)."':'".addslashes($value)."'";

	}
	return "{".implode(",", $pairs)."}";
}

function url($href = NULL, $args = Array()) {
	if (is_null($href)) {
		$href = $_SERVER['PHP_SELF'];
	}
	$href = ltrim($href, "/");
	$href = rtrim($href, "?");
	if (!preg_match("~^http://~", $href)) {
		if (isset($_SERVER['HTTP_HOST'])) {
			$href = "http://".$_SERVER['HTTP_HOST']."/".$href;
		} else {
			$href = "http://localhost/".$href;
		}
	}
	if (preg_match("/(.*)\\?(.*)/", $href, $matches)) {
		$href = $matches[1];
		parse_str($matches[2], $parsed);
		$args = array_merge($parsed, $args);
	}
	$params = Array();
	foreach ($args as $key => $value) {
		if (!is_null($value)) {
			$params[] = rawurlencode($key)."=".rawurlencode($value);
		}
	}
	if (count($params) > 0) {
		if (strpos($href, "?") === FALSE) {
			return $href."?".implode("&", $params);
		} else {
			return $href."&".implode("&", $params);
		}
	}
	return $href;
}

function error_handler($errno, $errstr, $errfile, $errline) {
	if (error_reporting() == 0) {
		return;
	}
	$error = Array(
		'code' => $errno,
		'message' => $errstr,
		'file' => $errfile,
		'line' => $errline,
	);
	if (@$GLOBALS['debug']) {
		header("Content-Type:text/xml");
		echo "<?xml version='1.0' ?>";
		echo utf8_encode(xml_serialize('error', $error));
	} else {
		error_log(var_export($error, TRUE)."\n", 3, dirname(__FILE__)."/errors.log");
		header("HTTP/1.0 500 Internal Error");
	}
	exit;
}
function exception_handler($ex) {
	error_handler($ex->getCode(), $ex->getMessage(), $ex->getFile(), $ex->getLine());
}
set_error_handler('error_handler');
if (function_exists('set_exception_handler')) {
	set_exception_handler('exception_handler');
}
require_once('config.php');
if ($delay === 'random') {
	sleep(rand(0,10));
} else if ($delay > 0) {
	die("sleep($delay);");
	sleep($delay);
}
if (!function_exists('recursive_array_map')) {
	function recursive_array_map($callback, &$var) {
		if (is_array($var)) {
			foreach (array_keys($var) as $key) {
				recursive_array_map($callback, $var[$key]);
			}
		} else {
			$var = call_user_func_array($callback, Array($var));
		}
	}
}
if (get_magic_quotes_gpc()) {
	recursive_array_map('stripslashes', $_GET);
	recursive_array_map('stripslashes', $_POST);
	recursive_array_map('stripslashes', $_COOKIES);
	recursive_array_map('stripslashes', $_REQUEST);
}
mysql_connect($host, $user, $password) or trigger_error(mysql_error());
mysql_query("USE ".$database) or trigger_error(mysql_error());
?>