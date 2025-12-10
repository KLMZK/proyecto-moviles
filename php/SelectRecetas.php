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

// Incluye CVE_CATEGORIA para que el cliente pueda filtrar por categoría.
// Si tu tabla recetas ya tiene la columna CVE_CATEGORIA esto funcionará.
// Si utilizas otra relación, cambia la consulta para hacer JOIN con la tabla correspondiente.
$sql = "SELECT R.CVE_RECETA AS CVE_RECETA, R.NOMBRE AS NOMBRE, R.CALORIAS AS CALORIAS, R.DIFICULTAD AS DIFICULTAD, R.TAMANO AS TAMANO, IFNULL(P.CVE_CATEGORIA, '') AS CVE_CATEGORIA FROM recetas AS R LEFT JOIN pertenece AS P ON R.CVE_RECETA = P.CVE_RECETA ORDER BY NOMBRE";

$res = $conexion->query($sql);
if (!$res) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed', 'detail' => $conexion->error]);
    $conexion->close();
    exit;
}

$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
echo json_encode($rows);
$conexion->close();
?>