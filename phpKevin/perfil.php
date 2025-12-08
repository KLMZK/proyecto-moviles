<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$nombre =$_POST['nombre'] ?? '';
$imagen= $_FILES['imagen']?? null;
$id = $_POST['id'];

$consulta = $conexion->query("SELECT NOMBRE FROM usuarios WHERE CVE_USUARIO = $id");
if ($fila = $consulta->fetch_assoc()) {
    $nombreO = $fila['NOMBRE'];
} else {
    echo json_encode(["ingreso" => 0, "error" => "Usuario no encontrado"]);
    exit();
}

$nombreArchivoNuevo = "{$nombre}_{$id}.jpg";
$rutaNueva = __DIR__ . '/perfil/' . $nombreArchivoNuevo;

$nombreArchivoViejo = "{$nombreO}_{$id}.jpg";
$rutaVieja = __DIR__ . "/perfil/" . $nombreArchivoViejo;


if ($nombreO !== $nombre && file_exists($rutaVieja)) {
    unlink($rutaVieja);
}

if ($imagen && isset($imagen['tmp_name']) && is_uploaded_file($imagen['tmp_name'])) {
    if (!move_uploaded_file($imagen['tmp_name'], $rutaNueva)) {
        echo json_encode(["ingreso" => 0, "error" => "Error al subir la imagen"]);
        exit();
    }
}

$sql = "UPDATE usuarios SET NOMBRE='$nombre' WHERE CVE_USUARIO=$id";
if ($conexion->query($sql)) {
    echo json_encode(["ingreso" => 1]);
} else {
    echo json_encode(["ingreso" => 0, "error" => $conexion->error]);
}

$conexion->close();
?>