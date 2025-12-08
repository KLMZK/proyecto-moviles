<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
include("conexion.php");

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;
if (!$start || !$end) {
    echo json_encode([]);
    exit;
}

$server_ip = $_SERVER['SERVER_ADDR'];
$base_url = "http://$server_ip/moviles/uploads/";

$sql = "
SELECT 
  a.CVE_AGENDA,
  a.CVE_RECETA,
  DATE(a.FECHA) AS FECHA,
  a.preparado,
  r.NOMBRE,
  r.CALORIAS,
  r.DIFICULTAD,
  r.TAMANO,
  r.CVE_RECETA AS idReceta
FROM agenda a
LEFT JOIN recetas r ON r.CVE_RECETA = a.CVE_RECETA
WHERE DATE(a.FECHA) BETWEEN ? AND ?
ORDER BY a.FECHA, r.NOMBRE
";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $start, $end);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($row = $res->fetch_assoc()) {
    $nombre_archivo = $row["NOMBRE"] . '_' . $row["idReceta"] . ".jpg";
    $imagen_url = $base_url . $nombre_archivo;
    $row['imagen'] = $imagen_url;
    $rows[] = $row;
}
echo json_encode($rows);
$stmt->close();
$conexion->close();
?>