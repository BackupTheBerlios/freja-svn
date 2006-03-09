<?php
require_once('php_inc/stdinc.php');
$model = new TableGateway();
$model->table = "contacts";
$model->pkey = "email";
require_once('php_inc/inc.resource.php');
?>