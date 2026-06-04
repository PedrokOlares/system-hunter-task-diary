const { execSync } = require('child_process');
const path = require('path');

function executarComando(comando) {
  try {
    return execSync(comando, { encoding: 'utf8' }).trim();
  } catch (error) {
    // Retorna o erro se o comando falhar
    return error.stderr ? error.stderr.trim() : error.message;
  }
}

function fazerCommitsIndividuais() {
  console.log("🔍 Buscando arquivos modificados ou não rastreados...");

  // Obtém a lista de arquivos alterados
  const statusOutput = executarComando("git status --porcelain");

  if (!statusOutput) {
    console.log("✨ Nenhum arquivo para commitar. Tudo limpo!");
    return;
  }

  // Separa as linhas de arquivos alterados
  const linhas = statusOutput.split("\n");

  for (const linha of linhas) {
    if (!linha) continue;

    // O status do git ocupa os 3 primeiros caracteres. Pegamos o resto que é o caminho.
    let caminhoArquivo = linha.substring(3).trim();

    // Remove aspas caso o nome do arquivo contenha espaços
    caminhoArquivo = caminhoArquivo.replace(/^["']|["']$/g, '');

    // Extrai apenas o nome do arquivo para montar a mensagem
    const nomeArquivo = path.basename(caminhoArquivo);
    const mensagemCommit = `Adiciona/Atualiza ${nomeArquivo}`;

    console.log(`\n📦 Processando: ${caminhoArquivo}`);

    // 1. Dá o "check" no arquivo (git add)
    executarComando(`git add "${caminhoArquivo}"`);

    // 2. Faz o commit individual do arquivo
    const resultadoCommit = executarComando(`git commit -m "${mensagemCommit}"`);
    
    if (resultadoCommit.includes("error")) {
      console.log(`⚠️ Erro ao commitar ${caminhoArquivo}`);
    } else {
      console.log(`✅ Commit realizado: '${mensagemCommit}'`);
    }
  }

  console.log("\n🚀 Todos os arquivos foram commitados individualmente com sucesso!");
}

fazerCommitsIndividuais();
