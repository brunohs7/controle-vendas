<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable('/var/www/vhosts/site.com/app');
$dotenv->load();

function generateToken($userId) {
    $key = $_ENV['JWT_SECRET']; // Obtenha a chave do arquivo .env
    $payload = [
        'iat' => time(),
        'exp' => time() + (60 * 60), // Expira em 1 hora
        'userId' => $userId,
    ];

    return JWT::encode($payload, $key, 'HS256');
}

function validateToken($token) {
    $key = $_ENV['JWT_SECRET'];
    try {
        error_log("Validando token: " . $token); // Log do token a ser validado
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return (array) $decoded;
    } catch (Exception $e) {
        error_log("Erro na validação do token: " . $e->getMessage());
        return null;
    }
}

