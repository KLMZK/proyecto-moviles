<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

session_start();
session_unset(); 
session_destroy(); 

echo json_encode([
    'estado' => 1,
    'mensaje' => 'Sesión cerrada correctamente'
]);
?>