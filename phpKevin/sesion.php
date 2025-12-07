<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();

include("conexion.php");

$input = json_decode(file_get_contents('php://input'), true);
$correo = isset($input['correo']) ? $input['correo'] : '';
$password = isset($input['password']) ? $input['password'] : '';

$sql = "SELECT * FROM usuarios WHERE CORREO = '$correo' AND PASSWORD = '$password'";

$result = $conexion->query($sql);

if(mysqli_num_rows($result) == 0){
    $usuario = array('ingreso' => 0);
} else {

    $usuario = array('ingreso' => 1);
    
    while($row = $result->fetch_assoc()) {
        $usuario[] = $row;
    }
    $_SESSION['usuario'] = $usuario;
}

echo json_encode($usuario);

$conexion->close();

?>