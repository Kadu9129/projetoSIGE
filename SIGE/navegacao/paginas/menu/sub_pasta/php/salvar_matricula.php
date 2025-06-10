<?php
header('Content-Type: application/json');

$entrada = json_decode(file_get_contents("php://input"), true);
$tipo = $entrada['tipo'] ?? '';
$dados = $entrada['dados'] ?? [];

if (!$tipo || empty($dados)) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Dados inválidos.']);
    exit;
}

// Define o caminho do arquivo com base no tipo (dentro da pasta "dados")
$arquivo = __DIR__ . "../Projeto/SIGE/dados/" . ($tipo === 'aluno' ? 'aluno_json.json' : 'professor_json.json');

// Garante que a pasta "dados" existe
if (!file_exists(dirname($arquivo))) {
    mkdir(dirname($arquivo), 0777, true);
}

// Garante que o arquivo exista
if (!file_exists($arquivo)) {
    file_put_contents($arquivo, json_encode([], JSON_PRETTY_PRINT));
}

// Adiciona um ID único ao novo registro
$dados['id'] = uniqid();

// Lê os dados existentes com segurança
$dadosExistente = json_decode(file_get_contents($arquivo), true);
if (!is_array($dadosExistente)) {
    $dadosExistente = [];
}

// Adiciona o novo registro ao array
$dadosExistente[] = $dados;

// Salva novamente no arquivo
file_put_contents($arquivo, json_encode($dadosExistente, JSON_PRETTY_PRINT));

// Retorna resposta JSON
echo json_encode([
    'sucesso' => true,
    'mensagem' => ucfirst($tipo) . ' salvo com sucesso!',
    'registro' => $dados
]);
