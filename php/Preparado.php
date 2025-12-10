<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);
$cve_agenda = $input['cve_agenda'] ?? null;
$target = isset($input['preparado']) ? (int)$input['preparado'] : null;
if (!$cve_agenda || !is_numeric($target)) {
    echo json_encode(['estado' => 0, 'mensaje' => 'datos faltantes']);
    exit;
}

$conexion->begin_transaction();

try {
    // obtener fila agenda y receta
    $stmt = $conexion->prepare("SELECT CVE_RECETA, preparado FROM agenda WHERE CVE_AGENDA = ? FOR UPDATE");
    $stmt->bind_param("i", $cve_agenda);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($row = $res->fetch_assoc()) {
        $cve_receta = $row['CVE_RECETA'];
        $actual = (int)$row['preparado'];
        if ($actual === $target) {
            // nada que hacer
            $conexion->commit();
            echo json_encode(['estado' => 1, 'mensaje' => 'sin cambios']);
            exit;
        }
    } else {
        throw new Exception('agenda no encontrada');
    }
    $stmt->close();

    // obtener ingredientes requeridos para la receta
    $stmt2 = $conexion->prepare("SELECT u.CVE_INGREDIENTE, u.CANTIDAD AS req_cantidad, IFNULL(i.CANTIDAD,0) AS disponible FROM utiliza u LEFT JOIN ingredientes i ON i.CVE_INGREDIENTE = u.CVE_INGREDIENTE WHERE u.CVE_RECETA = ?");
    $stmt2->bind_param("i", $cve_receta);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    $ings = [];
    while ($r = $res2->fetch_assoc()) $ings[] = $r;
    $stmt2->close();

    if ($target == 1) {
        // verificar que no quede negativo al restar
        foreach ($ings as $ing) {
            $new = (float)$ing['disponible'] - (float)$ing['req_cantidad'];
            if ($new < 0) {
                $conexion->rollback();
                echo json_encode(['estado' => 0, 'mensaje' => 'Ingredientes insuficientes', 'cve_ingrediente' => $ing['CVE_INGREDIENTE']]);
                exit;
            }
        }
        // restar cantidades
        $stmtUpd = $conexion->prepare("UPDATE ingredientes SET CANTIDAD = CANTIDAD - ? WHERE CVE_INGREDIENTE = ?");
        foreach ($ings as $ing) {
            $req = $ing['req_cantidad'];
            $cvei = $ing['CVE_INGREDIENTE'];
            $stmtUpd->bind_param("di", $req, $cvei);
            if (!$stmtUpd->execute()) throw new Exception('no se pudo restar ingrediente');
        }
        $stmtUpd->close();
    } else {
        // deshacer preparado: sumar cantidades de vuelta
        $stmtUpd = $conexion->prepare("UPDATE ingredientes SET CANTIDAD = CANTIDAD + ? WHERE CVE_INGREDIENTE = ?");
        foreach ($ings as $ing) {
            $req = $ing['req_cantidad'];
            $cvei = $ing['CVE_INGREDIENTE'];
            $stmtUpd->bind_param("di", $req, $cvei);
            if (!$stmtUpd->execute()) throw new Exception('no se pudo sumar ingrediente');
        }
        $stmtUpd->close();
    }

    // actualizar flag en agenda
    $stmt3 = $conexion->prepare("UPDATE agenda SET preparado = ? WHERE CVE_AGENDA = ?");
    $stmt3->bind_param("ii", $target, $cve_agenda);
    if (!$stmt3->execute()) throw new Exception('no se pudo actualizar agenda');
    $stmt3->close();

    $conexion->commit();
    echo json_encode(['estado' => 1]);
} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(['estado' => 0, 'mensaje' => $e->getMessage()]);
}
$conexion->close();
?>