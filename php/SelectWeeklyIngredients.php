<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
include("conexion.php");

$start = $_GET['start'] ?? null;
$end = $_GET['end'] ?? null;
if (!$start || !$end) { echo json_encode([]); exit; }

/*
  Calcular sólo lo que falta para las RECETAS NO preparadas.
  total_necesario = suma de u.CANTIDAD para las filas de agenda cuyo preparado = 0
  disponible = cantidad actual en ingredientes
  faltante = max(total_necesario - disponible, 0)
  costo_faltante = faltante * costo_unitario
*/
$sql = "
SELECT 
  u.CVE_INGREDIENTE,
  IFNULL(i.NOMBRE,'') AS NOMBRE,
  SUM(u.CANTIDAD * (1 - IFNULL(a.preparado,0))) AS total_necesario,
  IFNULL(i.CANTIDAD,0) AS disponible,
  IFNULL(i.COSTO,0) AS costo_unitario,
  IF( SUM(u.CANTIDAD * (1 - IFNULL(a.preparado,0))) - IFNULL(i.CANTIDAD,0) > 0,
      SUM(u.CANTIDAD * (1 - IFNULL(a.preparado,0))) - IFNULL(i.CANTIDAD,0),
      0
  ) AS faltante,
  (IF( SUM(u.CANTIDAD * (1 - IFNULL(a.preparado,0))) - IFNULL(i.CANTIDAD,0) > 0,
      SUM(u.CANTIDAD * (1 - IFNULL(a.preparado,0))) - IFNULL(i.CANTIDAD,0),
      0
  ) * IFNULL(i.COSTO,0)) AS costo_faltante,
  IFNULL(i.UNIDAD, '') AS UNIDAD
FROM agenda a
JOIN utiliza u ON u.CVE_RECETA = a.CVE_RECETA
LEFT JOIN ingredientes i ON i.CVE_INGREDIENTE = u.CVE_INGREDIENTE
WHERE DATE(a.FECHA) BETWEEN ? AND ?
GROUP BY u.CVE_INGREDIENTE
ORDER BY i.NOMBRE
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $start, $end);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
echo json_encode($rows);
$stmt->close();
$conexion->close();
?>