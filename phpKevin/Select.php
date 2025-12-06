<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();

include("conexion.php");

$sql= "SELECT CVE_CATEGORIA AS id, NOMBRE AS nombre FROM categoria";
$result = $conexion->query($sql);
while($row = $result->fetch_assoc()) {
        $categoria[] = $row;
    }
echo json_encode($categoria);

$conexion->close();

?>