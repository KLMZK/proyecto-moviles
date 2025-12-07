<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$correo = $_POST['correo'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';
$perfil_dir = "perfil/";

if(empty($correo) || empty($nombre) || empty($contrasena)){
    echo json_encode(['estado' => 0, 'mensaje' => 'Faltan datos']);
    exit;
}

$stmt2 = $conexion->prepare("INSERT INTO usuarios (NOMBRE, PASSWORD, CORREO) VALUES ('$nombre','$contrasena','$correo')");

if($stmt2->execute()){
    echo json_encode(['estado' => 1]);
} else {
    echo json_encode(['estado' => 0]);
}
$id = mysqli_insert_id($conexion); 

if (!file_exists($perfil_dir)) {
    mkdir($perfil_dir, 0755, true); 
}
$rutaImagen = "";  

if (isset($_FILES["imagen"])) {
    $nombre_limpio = preg_replace('/[^A-Za-z0-9]/', '', $nombre);
    $nombre_archivo = $nombre_limpio."_" . $id . ".jpg";
    $guardar_en = $perfil_dir . $nombre_archivo;

    if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $guardar_en)) {
        chmod($guardar_en, 0644);
        $rutaImagen = $guardar_en;
    }
}

$conexion->close();
?>