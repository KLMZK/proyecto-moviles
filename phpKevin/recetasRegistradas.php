<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);
$cve_categoria = $input['cve_categoria'] ?? 0;

if ($cve_categoria <= 0) {
    echo json_encode(['estado' => 0, 'mensaje' => 'Categoría no válida']);
    exit;
}

$query = "
    SELECT r.CVE_RECETA, r.NOMBRE, r.DESCRIPCION, r.CALORIAS, r.DIFICULTAD, r.TAMANO,
           COUNT(u.CVE_INGREDIENTE) AS num_ingredientes
    FROM receta r
    INNER JOIN pertenece p ON r.CVE_RECETA = p.CVE_RECETA
    LEFT JOIN utiliza u ON r.CVE_RECETA = u.CVE_RECETA
    WHERE p.CVE_CATEGORIA = ?
    GROUP BY r.CVE_RECETA, r.NOMBRE, r.DESCRIPCION, r.CALORIAS, r.DIFICULTAD, r.TAMANO
    ORDER BY r.CVE_RECETA ASC
";

$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $cve_categoria);
$stmt->execute();
$result = $stmt->get_result();

$recetas = [];
while ($row = $result->fetch_assoc()) {
    $recetas[] = [
        'cve_receta' => (int)$row['CVE_RECETA'],
        'nombre' => $row['NOMBRE'],
        'descripcion' => $row['DESCRIPCION'],
        'calorias' => (int)$row['CALORIAS'],
        'dificultad' => $row['DIFICULTAD'],
        'tamano' => (int)$row['TAMANO'],
        'num_ingredientes' => (int)$row['num_ingredientes']
    ];
}

if (empty($recetas)) {
    echo json_encode(['estado' => 0, 'mensaje' => 'No se encontraron recetas']);
} else {
    echo json_encode(['estado' => 1, 'recetas' => $recetas]);
}

$stmt->close();
$conexion->close();
?>
