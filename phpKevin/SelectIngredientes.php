<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include("conexion.php");

$query = "SELECT CVE_INGREDIENTE, NOMBRE, CANTIDAD, COSTO, CLASIFICACION, UNIDAD FROM ingredientes";
$result = $conexion->query($query);

$ingredientes = [
    "Frutas y Verduras" => [],
    "Panadería y Pastelería" => [],
    "Refrigerados" => [],
    "Carnicería" => [],
    "Pescadería" => [],
    "Congelados" => [],
    "Despensa / Secos (Abarrotes)" => [],
    "Bebidas" => [],
    "Snacks y Dulces" => []
];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $clasificacion = $row['CLASIFICACION'];
        if (array_key_exists($clasificacion, $ingredientes)) {
            $ingredientes[$clasificacion][] = [
                'nombre' => $row['NOMBRE'],
                'cantidad' => $row['CANTIDAD'],
                'costo' => ($row['COSTO']*$row['CANTIDAD']),
                'unidad' => $row['UNIDAD'],
                'cve_ingrediente' => $row['CVE_INGREDIENTE']
            ];
        }
    }
    echo json_encode(['estado' => 1, 'ingredientes' => $ingredientes]);
} else {
    echo json_encode(['estado' => 0]);
}

$conexion->close();
?>