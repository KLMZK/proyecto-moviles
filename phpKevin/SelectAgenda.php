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
    // construir imagen
    $nombre_limpio = preg_replace('/[^A-Za-z0-9]/', '', $row["NOMBRE"]);
    $nombre_archivo = $nombre_limpio . '_' . $row["idReceta"] . ".jpg";
    $imagen_url = $base_url . $nombre_archivo;
    $row['imagen'] = $imagen_url;

    // obtener ingredientes para la receta
    $stmt2 = $conexion->prepare("SELECT u.CVE_INGREDIENTE, i.NOMBRE AS ING_NOMBRE, u.CANTIDAD AS REQ_CANTIDAD, i.CANTIDAD AS DISPONIBLE, i.COSTO, i.UNIDAD FROM utiliza u LEFT JOIN ingredientes i ON i.CVE_INGREDIENTE = u.CVE_INGREDIENTE WHERE u.CVE_RECETA = ?");
    $stmt2->bind_param("i", $row['CVE_RECETA']);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    $ings = [];
    while ($r2 = $res2->fetch_assoc()) {
        $ings[] = $r2;
    }
    $stmt2->close();
    $row['ingredientes'] = $ings;

    $rows[] = $row;
}
echo json_encode($rows);
$stmt->close();
$conexion->close();
?>