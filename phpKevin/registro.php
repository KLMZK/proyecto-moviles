<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);

$correo = $input['correo'] ?? '';
$nombre = $input['nombre'] ?? '';
$contrasena = $input['contrasena'] ?? '';

if(empty($correo) || empty($nombre) || empty($contrasena)){
    echo json_encode(['estado' => 0, 'mensaje' => 'Faltan datos']);
    exit;
}

$stmt2 = $conexion->prepare("INSERT INTO usuarios (NOMBRE, PASSWORD, CORREO) VALUES ('$nombre','$contrasena','$correo')");

if($stmt2->execute()){
    echo json_encode(['estado' => 1]);
} else {
    echo json_encode(['estado' => 0]);
}

$conexion->close();
?>