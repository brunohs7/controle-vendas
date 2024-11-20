<?php

header("Access-Control-Allow-Origin: http://localhost:8081"); // Ou o domínio do seu app
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

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

try {
    // Consulta para selecionar todas as vendas
    $stmt = $pdo->prepare("SELECT * FROM vendas");
    $stmt->execute();

    // Obtém todos os resultados
    $vendas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formata a data de YYYY-MM-DD para DD/MM/YYYY
    foreach ($vendas as &$venda) {
        $venda['data'] = date('d/m/Y', strtotime($venda['data']));
    }

    // Retorna as vendas em formato JSON
    echo json_encode(['success' => true, 'sales' => $vendas]); // Adiciona sucesso
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao acessar o banco de dados: ' . $e->getMessage()]);
}

?>
