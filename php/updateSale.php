<?php

header("Access-Control-Allow-Origin: http://localhost:8081"); // Ou o domínio do seu app
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

require 'db.php';
require 'auth.php';

$headers = apache_request_headers();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;


if (!$token || !validateToken($token)) {
    echo json_encode(['success' => false, 'message' => 'Token inválido ou não fornecido.']);
    exit;
}

function convertDateToSQLFormat($date) {
    $dateArray = explode('/', $date);
    return $dateArray[2] . '-' . $dateArray[1] . '-' . $dateArray[0];
}

$data = json_decode(file_get_contents('php://input'), true);

file_put_contents('debug_log.txt', "Dados recebidos: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

if (isset($data['date'], $data['sale'], $data['cost'], $data['commission'])) {
    $date = convertDateToSQLFormat($data['date']);
    $sale = $data['sale'];
    $cost = $data['cost'];
    $commission = $data['commission'];
    
    $observation = isset($data['obs']) ? $data['obs'] : '';

    file_put_contents('debug_log.txt', "Dados para a query: " . print_r(['data' => $date, 'sale' => $sale, 'cost' => $cost, 'commission' => $commission, 'obs' => $observation], true) . PHP_EOL, FILE_APPEND);

    if (isset($data['id'])) {
        $id = $data['id'];

        $stmt = $pdo->prepare("UPDATE vendas SET data = :data, sale = :sale, cost = :cost, commission = :commission, obs = :obs WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'data' => $date,
            'sale' => $sale,
            'cost' => $cost,
            'commission' => $commission,
            'obs' => $observation
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Venda atualizada com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nenhuma alteração realizada ou venda não encontrada.']);
        }
    } else {
        $stmt = $pdo->prepare("INSERT INTO vendas (data, sale, cost, commission, obs) VALUES (:data, :sale, :cost, :commission, :obs)");
        $stmt->execute([
            'data' => $date,
            'sale' => $sale,
            'cost' => $cost,
            'commission' => $commission,
            'obs' => $observation
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Venda adicionada com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar venda.']);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
}
?>
