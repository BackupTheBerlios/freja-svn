This example requires PHP v.4 or 5 + MySQL, and probably only works with apache as server.
You should create a database, and import the following table into it.

CREATE TABLE `contacts` (
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  PRIMARY KEY  (`email`)
);

Edit models/php_inc/config.php to suite your enviroment.