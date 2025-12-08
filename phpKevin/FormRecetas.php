<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
include("conexion.php");

$nombre =$_POST['nombre'] ?? '';
$clas =$_POST['clas'] ?? '';
$instrucciones = json_decode($_POST['instrucciones'] ?? '[]', true);
$ingrediente = json_decode($_POST['ingrediente'] ?? '[]', true);
if (!is_array($ingrediente)) $ingrediente = [];
$calorias = $_POST['calorias'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$personas = $_POST['personas'] ?? '';
$presupuesto = $_POST['presupuesto'] ?? '';
$upload_dir = "uploads/";
$instruccionesConPaso = [];
foreach($instrucciones as $index => $paso) {
    $paso = trim($paso);
    if($paso !== "") {
        $instruccionesConPaso[] = "Paso ".($index+1).": $paso";
    }
}
$instruccionesTexto = implode("\n", $instruccionesConPaso);


$sql = "INSERT INTO recetas (CVE_RECETA, NOMBRE, DESCRIPCION, CALORIAS, DIFICULTAD, TAMANO, PRESUPUESTO) 
        VALUES ('','$nombre', '$instruccionesTexto', '$calorias', '$dificultad', '$personas', '$presupuesto')";

if (mysqli_query($conexion, $sql)) {
    $idReceta = mysqli_insert_id($conexion);
    mysqli_query($conexion, "INSERT INTO pertenece (CVE_CATEGORIA, CVE_RECETA) VALUES ('$clas','$idReceta')");

    foreach ($ingrediente as $ing) {
        $nomIngr = $ing['ingrediente'];
        $cantidad = $ing['cantidad'];
        $costo = $ing['costo']?? 0;
        $unidad = $ing['unidad']?? '';
        $clasificacion = $ing['clasificacion']??'';
        mysqli_query($conexion, "INSERT INTO ingredientes (CVE_INGREDIENTE, NOMBRE, CANTIDAD, COSTO, CLASIFICACION, UNIDAD)
                             VALUES ('', '$nomIngr', '','$costo','$clasificacion','$unidad')");
        $idIngr = mysqli_insert_id($conexion);
        mysqli_query($conexion,"INSERT INTO utiliza (CVE_INGREDIENTE,CVE_RECETA,CANTIDAD)
                                    VALUES ('$idIngr','$idReceta','$cantidad')");
    }

    echo json_encode(["ingreso" => 1]);
} else {
    echo json_encode(["ingreso" => 0]);
}

if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true); 
}

$rutaImagen = "";  

if (isset($_FILES["imagen"])) {
    $nombre_archivo = $nombre."_" . $idReceta . ".jpg";
    $guardar_en = $upload_dir . $nombre_archivo;

    if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $guardar_en)) {
        chmod($guardar_en, 0644);
        $rutaImagen = $guardar_en;
    }
}

$conexion->close();
?>