<?php
include "conexion.php";
$ip = $_SERVER['SERVER_ADDR'];

$cve = $_GET['cve'];
$query = $conexion->prepare("SELECT recetas.CVE_RECETA, recetas.NOMBRE, recetas.CALORIAS, recetas.TAMANO, recetas.DIFICULTAD,recetas.DESCRIPCION, ingredientes.NOMBRE as NOMBREING, ingredientes.UNIDAD, utiliza.CANTIDAD
                         FROM recetas 
                         LEFT JOIN utiliza ON recetas.CVE_RECETA = utiliza.CVE_RECETA
                         LEFT JOIN ingredientes ON ingredientes.CVE_INGREDIENTE = utiliza.CVE_INGREDIENTE
                         WHERE recetas.CVE_RECETA = $cve");
$query->execute();
$result = $query->get_result();

$receta = [
    'INGREDIENTES' => []
];
while($row = $result->fetch_assoc()){
    $receta['CVE_RECETA'] = $row['CVE_RECETA'];
    $receta['NOMBRE'] = $row['NOMBRE'];
    $receta['CALORIAS'] = $row['CALORIAS'];
    $receta['TAMANO'] = $row['TAMANO'];
    $receta['DIFICULTAD'] = $row['DIFICULTAD'];
    $receta['DESCRIPCION'] = $row['DESCRIPCION'];
    $nombre_limpio = preg_replace('/[^A-Za-z0-9]/', '', $row["NOMBRE"]);
    $receta['IMAGEN'] = "http://".$ip."/moviles/uploads/".$nombre_limpio."_".$row["CVE_RECETA"].".jpg";

        if($row['NOMBREING'] != null){
        $receta['INGREDIENTES'][] = [
            'NOMBRE' => $row['NOMBREING'],
            'CANTIDAD' => $row['CANTIDAD'],
            'UNIDAD' => $row['UNIDAD']
        ];
    }

}

echo json_encode($receta);
?>