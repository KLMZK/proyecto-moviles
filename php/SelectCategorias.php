<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("conexion.php");

$sql = "SELECT CVE_CATEGORIA, NOMBRE FROM categoria ORDER BY NOMBRE";
$result = $conexion->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'detail' => $conexion->error]);
    $conexion->close();
    exit;
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows);
$conexion->close();
?>