<?php
$result = $model->select(@$_REQUEST['orderby'], @$_REQUEST['direction'], @$_REQUEST['limit'], @$_REQUEST['offset']);
header("Content-Type:text/xml");
echo "<?xml version='1.0' ?>";
echo "<result>\n";
foreach ($result as $row) {
	$row['url'] = url(dirname($_SERVER['PHP_SELF'])."/contact.php", Array($model->pkey => $row[$model->pkey]));
//	$row['pkey'] = json_serialize($row);
	echo xml_serialize('record', $row);
}
echo "</result>\n";
?>