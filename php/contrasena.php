<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);

$val = $input['Val'] ?? 0;
$correo = $input['correo'] ?? '';
$nombre = $input['nombre'] ?? '';
$contrasena = $input['contrasena'] ?? '';
$nueva_contrasena = $input['Ncontrasena'] ?? '';

if (empty($correo) || empty($nueva_contrasena)) {
    echo json_encode(['estado' => 0, 'mensaje' => 'Faltan datos']);
    exit;
}

if ($val == 4) {
    if (empty($nombre)) {
        echo json_encode(['estado' => 0, 'mensaje' => 'Nombre requerido']);
        exit;
    }
    $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE correo = ? AND nombre = ?");
    $stmt->bind_param("ss", $correo, $nombre);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['estado' => 0, 'mensaje' => 'Usuario no encontrado']);
        exit;
    }

} else if ($val == 1) {
    if (empty($contrasena)) {
        echo json_encode(['estado' => 0, 'mensaje' => 'Contraseña actual requerida']);
        exit;
    }

    $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE correo = ? AND password = ?");
    $stmt->bind_param("ss", $correo, $contrasena);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['estado' => 0, 'mensaje' => 'Contraseña incorrecta']);
        exit;
    }
} else {
    echo json_encode(['estado' => 0, 'mensaje' => 'Valor de operación inválido']);
    exit;
}

$stmt2 = $conexion->prepare("UPDATE usuarios SET password = ? WHERE correo = ?");
$stmt2->bind_param("ss", $nueva_contrasena, $correo);

if ($stmt2->execute()) {
    echo json_encode(['estado' => 1, 'mensaje' => 'Contraseña actualizada correctamente']);
} else {
    echo json_encode(['estado' => 0, 'mensaje' => 'Error al actualizar contraseña']);
}

$conexion->close();
?>