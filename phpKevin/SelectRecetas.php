<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
include("conexion.php");
$sql = "SELECT CVE_RECETA, NOMBRE, CALORIAS, DIFICULTAD, TAMANO FROM recetas ORDER BY NOMBRE";
$res = $conexion->query($sql);
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
echo json_encode($rows);
$conexion->close();
?>