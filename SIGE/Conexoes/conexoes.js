// scripts/conexoes.js

const BASE_URL = '/SIGE/dados/';

// Utilitários
async function carregarArquivo(nomeArquivo) {
  const resposta = await fetch(`${BASE_URL}${nomeArquivo}`);
  if (!resposta.ok) throw new Error(`Erro ao carregar ${nomeArquivo}`);
  return resposta.json();
}

async function salvarArquivo(nomeArquivo, dados) {
  console.warn(`Simulação de salvamento em ${nomeArquivo}:`, dados);
  // Exemplo futuro:
  // await fetch(`/api/salvar.php?arquivo=${nomeArquivo}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(dados)
  // });
}

// === TURMAS ===
async function buscarTurmas() {
  return await carregarArquivo('dados_turmas.json');
}

async function adicionarTurma(turma) {
  const turmas = await buscarTurmas();
  turmas.push(turma);
  await salvarArquivo('dados_turmas.json', turmas);
}

async function atualizarTurma(id, novaTurma) {
  const turmas = await buscarTurmas();
  const index = turmas.findIndex(t => t.id === id);
  if (index >= 0) {
    turmas[index] = novaTurma;
    await salvarArquivo('dados_turmas.json', turmas);
  }
}

async function removerTurma(id) {
  let turmas = await buscarTurmas();
  turmas = turmas.filter(t => t.id !== id);
  await salvarArquivo('dados_turmas.json', turmas);
}

// === ALUNOS ===
async function buscarAlunos() {
  return await carregarArquivo('dados_alunos.json');
}


async function adicionarAluno(aluno) {
  const alunos = await buscarAlunos();
  alunos.push(aluno);
  await salvarArquivo('dados_alunos.json', alunos);
}

async function atualizarAluno(id, novoAluno) {
  const alunos = await buscarAlunos();
  const index = alunos.findIndex(a => a.id === id);
  if (index >= 0) {
    alunos[index] = novoAluno;
    await salvarArquivo('dados_alunos.json', alunos);
  }
}

async function removerAluno(id) {
  let alunos = await buscarAlunos();
  alunos = alunos.filter(a => a.id !== id);
  await salvarArquivo('dados_alunos.json', alunos);
}

// === PROFESSORES ===
async function buscarProfessores() {
  return await carregarArquivo('dados_professores.json');
}

async function adicionarProfessor(professor) {
  const professores = await buscarProfessores();
  professores.push(professor);
  await salvarArquivo('dados_professores.json', professores);
}

async function atualizarProfessor(id, novoProfessor) {
  const professores = await buscarProfessores();
  const index = professores.findIndex(p => p.id === id);
  if (index >= 0) {
    professores[index] = novoProfessor;
    await salvarArquivo('dados_professores.json', professores);
  }
}

async function removerProfessor(id) {
  let professores = await buscarProfessores();
  professores = professores.filter(p => p.id !== id);
  await salvarArquivo('dados_professores.json', professores);
}

// === MATRICULAS ===
async function buscarMatriculas() {
  return await carregarArquivo('dados_matriculas.json');
}

async function adicionarMatricula(matricula) {
  const matriculas = await buscarMatriculas();
  matriculas.push(matricula);
  await salvarArquivo('dados_matriculas.json', matriculas);
}

async function atualizarMatricula(id, novaMatricula) {
  const matriculas = await buscarMatriculas();
  const index = matriculas.findIndex(m => m.id === id);
  if (index >= 0) {
    matriculas[index] = novaMatricula;
    await salvarArquivo('dados_matriculas.json', matriculas);
  }
}

async function removerMatricula(id) {
  let matriculas = await buscarMatriculas();
  matriculas = matriculas.filter(m => m.id !== id);
  await salvarArquivo('dados_matriculas.json', matriculas);
}
