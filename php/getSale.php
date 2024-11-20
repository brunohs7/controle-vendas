<?php

header("Access-Control-Allow-Origin: http://localhost:8081"); // Ou o domínio do seu app
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");

require 'db.php';
require 'auth.php'; // Incluindo o arquivo de autenticação

// Verifica se o token foi enviado no cabeçalho
$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if (strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7); // Remove "Bearer " do token
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

// Verifica se o ID da venda foi fornecido via GET
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID da venda não fornecido.']);
    exit;
}

$saleId = $_GET['id'];

try {
    // Consulta para selecionar a venda pelo ID
    $stmt = $pdo->prepare("SELECT * FROM vendas WHERE id = :id");
    $stmt->bindParam(':id', $saleId, PDO::PARAM_INT);
    $stmt->execute();

    // Obtém o resultado da consulta
    $venda = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($venda) {
        // Formata a data de YYYY-MM-DD para DD/MM/YYYY
        $venda['data'] = date('d/m/Y', strtotime($venda['data']));

        // Retorna os dados da venda em formato JSON
        echo json_encode(['success' => true, 'sale' => $venda]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Venda não encontrada.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao acessar o banco de dados: ' . $e->getMessage()]);
}

?>
