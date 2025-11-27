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

if (empty($correo) || empty($nombre)) {
    echo json_encode(['estado' => 0, 'mensaje' => 'Datos incompletos']);
    exit;
}

$stmt = $conexion->prepare("DELETE FROM usuarios WHERE correo = ? AND nombre = ?");
$stmt->bind_param("ss", $correo, $nombre);

if ($stmt->execute()) {
    echo json_encode(['estado' => 1, 'mensaje' => 'Cuenta eliminada']);
} else {
    echo json_encode(['estado' => 0, 'mensaje' => 'Error al eliminar cuenta']);
}

$conexion->close();
?>