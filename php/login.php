<?php

header("Access-Control-Allow-Origin: http://localhost:8081"); // Ou o domínio do seu app
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php'; 
require 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebendo os dados da requisição
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    // Verifique se os dados foram fornecidos
    if (!$email || !$password) {
        echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios.']);
        exit;
    }

    // Verifique se o usuário existe e a senha está correta
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
		
	if ($user && password_verify($password, $user['password'])) {
		$token = generateToken($user['id']); // Gere o token para o usuário
		echo json_encode(['success' => true, 'token' => $token]);
	} else {
		echo json_encode(['success' => false]);
	}

}
?>
