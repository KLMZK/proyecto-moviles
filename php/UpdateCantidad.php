<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);

$cantidad = $input['cantidad'] ?? '';

$cve = $input['cve'] ?? $input['cve_ingrediente'] ?? $input['CVE_INGREDIENTE'] ?? '';

if ($cantidad === '' || $cve === '') {
    echo json_encode(['estado' => 0, 'mensaje' => 'Faltan datos']);
    exit;
}

$cantidad_num = is_numeric($cantidad) ? $cantidad : null;
if ($cantidad_num === null) {
    echo json_encode(['estado' => 0, 'mensaje' => 'Cantidad inválida']);
    exit;
}

$stmt = $conexion->prepare("UPDATE ingredientes SET CANTIDAD = ? WHERE CVE_INGREDIENTE = ?");
if (!$stmt) {
    echo json_encode(['estado' => 0, 'mensaje' => 'Error en la consulta']);
    exit;
}

$stmt->bind_param("ss", $cantidad_num, $cve);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['estado' => 1]);
    } else {
        echo json_encode(['estado' => 0, 'mensaje' => 'No se actualizó (id no encontrado o misma cantidad)']);
    }
} else {
    echo json_encode(['estado' => 0, 'mensaje' => 'Error al ejecutar']);
}

$stmt->close();
$conexion->close();
?>