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

$accion = $_POST["accion"] ?? "";
$cve = isset($_POST['cve']) ? intval(trim($_POST['cve'])) : null;
$idReceta = $cve;
$nombre = $_POST['nombre'] ?? '';
$clas = $_POST['clas'] ?? '';
$instrucciones = json_decode($_POST['instrucciones'] ?? '[]', true);
$ingrediente = json_decode($_POST['ingrediente'] ?? '[]', true);
$calorias = $_POST['calorias'] ?? '';
$dificultad = $_POST['dificultad'] ?? '';
$personas = $_POST['personas'] ?? '';
$presupuesto = $_POST['presupuesto'] ?? '';

$upload_dir = __DIR__ . "/uploads/";
if (!file_exists($upload_dir)) mkdir($upload_dir, 0755, true);

$response = ["ingreso" => 0];

// Preparar instrucciones
$texto = [];
foreach ($instrucciones as $i => $paso) {
    $paso = trim($paso);
    if ($paso !== "") {
        $texto[] = "Paso " . ($i + 1) . ": " . $paso;
    }
}
$instruccionesTexto = implode("\n", $texto);

// ==========================================
// EDITAR RECETA
// ==========================================
if ($accion === "editar" && $idReceta) {

    // OBTENER NOMBRE ORIGINAL
    $res = mysqli_query($conexion, "SELECT NOMBRE FROM recetas WHERE CVE_RECETA='$idReceta' LIMIT 1");
    if ($row = mysqli_fetch_assoc($res)) {
        $nombreO = $row['NOMBRE'];
    } else {
        echo json_encode(["ingreso" => 0, "error" => "Receta no encontrada"]);
        exit();
    }

    // Actualizar datos básicos
    mysqli_query($conexion,
        "UPDATE recetas SET 
            NOMBRE='$nombre',
            DESCRIPCION='$instruccionesTexto',
            CALORIAS='$calorias',
            DIFICULTAD='$dificultad',
            TAMANO='$personas',
            PRESUPUESTO='$presupuesto'
         WHERE CVE_RECETA='$idReceta'"
    );

    // Categoría
    if (!empty($clas)) {
        mysqli_query($conexion, "DELETE FROM pertenece WHERE CVE_RECETA='$idReceta'");
        mysqli_query($conexion, "INSERT INTO pertenece (CVE_CATEGORIA, CVE_RECETA) VALUES ('$clas', '$idReceta')");
    }

    // Ingredientes
    if (!empty($ingrediente) && $ingrediente !== "__NO_CAMBIAR__") {
        mysqli_query($conexion, "DELETE FROM utiliza WHERE CVE_RECETA='$idReceta'");
        foreach ($ingrediente as $ing) {
            $idIng = $ing["cve_ingrediente"];
            $cant = $ing["cantidad"];
            mysqli_query($conexion, "INSERT INTO utiliza (CVE_INGREDIENTE, CVE_RECETA, CANTIDAD) VALUES ('$idIng', '$idReceta', '$cant')");
        }
    }

    // Imagen
    $imagen = $_FILES['imagen'] ?? null;
    $nombreArchivoViejo = "{$nombreO}_{$idReceta}.jpg";
    $rutaVieja = $upload_dir . $nombreArchivoViejo;
    $nombreArchivoNuevo = "{$nombre}_{$idReceta}.jpg";
    $rutaNueva = $upload_dir . $nombreArchivoNuevo;

    if ($nombre !== $nombreO && (!$imagen || empty($imagen['tmp_name']))) {
        if (file_exists($rutaVieja)) rename($rutaVieja, $rutaNueva);
    } elseif ($imagen && isset($imagen['tmp_name']) && is_uploaded_file($imagen['tmp_name'])) {
        if (file_exists($rutaVieja)) unlink($rutaVieja);
        if (!move_uploaded_file($imagen['tmp_name'], $rutaNueva)) {
            echo json_encode(["ingreso" => 0, "error" => "Error al subir la imagen"]);
            exit();
        }
    }

    $response["ingreso"] = 1;
    $response["cveReceta"] = $idReceta;
}

echo json_encode($response);
$conexion->close();
?>
