<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
include("conexion.php");
$input = json_decode(file_get_contents('php://input'), true);
$cve = $input['cve_agenda'] ?? null;
if (!$cve) { echo json_encode(['estado'=>0]); exit; }
$stmt = $conexion->prepare("DELETE FROM agenda WHERE CVE_AGENDA = ?");
$stmt->bind_param("i", $cve);
if ($stmt->execute()) { echo json_encode(['estado'=>1]); } else { echo json_encode(['estado'=>0]); }
$stmt->close();
$conexion->close();
?>