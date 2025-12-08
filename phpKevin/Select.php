<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");
$server_ip = $_SERVER['SERVER_ADDR'];
$base_url = "http://$server_ip/moviles/uploads/";

$sql = "
SELECT 
    categoria.CVE_CATEGORIA AS id,
    categoria.NOMBRE AS nombreCategoria,
    recetas.CVE_RECETA AS idRecetas,
    recetas.NOMBRE AS nombreRecetas,
    recetas.CALORIAS AS calorias,
    recetas.DIFICULTAD AS dificultad,
    recetas.TAMANO AS tamano,
    (
        SELECT COUNT(*)
        FROM utiliza 
        WHERE utiliza.CVE_RECETA = recetas.CVE_RECETA
    ) AS ingredientes
FROM categoria
LEFT JOIN pertenece 
    ON categoria.CVE_CATEGORIA = pertenece.CVE_CATEGORIA
LEFT JOIN recetas 
    ON recetas.CVE_RECETA = pertenece.CVE_RECETA
ORDER BY categoria.CVE_CATEGORIA;
";

$result = $conexion->query($sql);

$categorias = [];

while ($row = $result->fetch_assoc()) {

    $id = $row["id"];

    if (!isset($categorias[$id])) {
        $categorias[$id] = [
            "id" => $row["id"],
            "nombreCategoria" => $row["nombreCategoria"],
            "recetas" => []
        ];
    }
    if ($row["idRecetas"] != null) {
        $nombre_archivo = $nombre_receta_sanitizado . "_" . $row["idRecetas"] . ".jpg";
        $imagen = $base_url . $nombre_archivo;
        $categorias[$id]["recetas"][] = [
            "idReceta" => $row["idRecetas"],
            "nombreRecetas" => $row["nombreRecetas"],
            "calorias" => $row["calorias"],
            "dificultad" => $row["dificultad"],
            "tamano" => $row["tamano"],
            "ingredientes" => $row["ingredientes"],
            "imagen" => $imagen_url
        ];
    }
}

echo json_encode(array_values($categorias));
$conexion->close();
?>
