<?php

header("Access-Control-Allow-Origin: http://localhost:8081");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: DELETE");

require 'db.php';
require 'auth.php';

// Verifica se o token foi enviado no cabeçalho
$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if (strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
} else {
    echo json_encode(['success' => false, 'message' => 'Token não fornecido.']);
    exit;
}

// Valida o token
$userData = validateToken($token);

if (!$userData) {
    echo json_encode(['success' => false, 'message' => 'Token inválido.']);
    exit;
}

// Obtém o ID da venda da URL
parse_str($_SERVER['QUERY_STRING'], $params);
$saleId = $params['id'] ?? null;

if (!$saleId) {
    echo json_encode(['success' => false, 'message' => 'ID da venda não fornecido.']);
    exit;
}

try {
    // Consulta para remover a venda
    $stmt = $pdo->prepare("DELETE FROM vendas WHERE id = :id");
    $stmt->bindParam(':id', $saleId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Venda removida com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Venda não encontrada.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao acessar o banco de dados: ' . $e->getMessage()]);
}
?>
