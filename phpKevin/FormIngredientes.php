<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);

$nombre = $input['nombre'] ?? '';
$cantidad = $input['cantidad'] ?? '';
$costo = $input['costo'] ?? '';
$clasificacion = $input['clasificacion'] ?? '';
$unidad = $input['unidad'] ?? '';

if(empty($nombre) || empty($cantidad) || empty($costo) || empty($clasificacion) || empty($unidad)){
    echo json_encode(['estado' => 0, 'mensaje' => 'Faltan datos']);
    exit;
}

mysqli_query($conexion, "INSERT INTO ingredientes (CVE_INGREDIENTE,NOMBRE,CANTIDAD,CLASIFICACION,UNIDAD) VALUES ('','$nombre','$cantidad','$costo','$clasificacion','$unidad')");

if($stmt2->execute()){
    echo json_encode(['estado' => 1, 'mensaje' => 'Cuenta creada correctamente']);
} else {
    echo json_encode(['estado' => 0, 'mensaje' => 'Error al crear la cuenta']);
}

$conexion->close();
?>