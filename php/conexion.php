<?php

$server = "localhost";
$username = "RotXa";
$password = "123";
$database = "rotxa";
$conexion = mysqli_connect($server, $username, $password, $database);
if(!$conexion) die("Conexion fallida: " . mysqli_connect_error());

?>