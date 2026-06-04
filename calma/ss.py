import subprocess
import os

def executar_comando(comando):
    """Executa um comando no terminal e retorna a saída."""
    resultado = subprocess.run(comando, shell=True, capture_output=True, text=True)
    return resultado.stdout.strip(), resultado.stderr.strip()

def fazer_commits_individuais():
    print("🔍 Buscando arquivos modificados ou não rastreados...")
    
    # Obtém a lista de arquivos alterados (modificados, deletados ou novos)
    stdout, stderr = executar_comando("git status --porcelain")
    
    if not stdout:
        print("✨ Nenhum arquivo para commitar. Tudo limpo!")
        return

    # Limpa as linhas e separa os arquivos em uma lista
    linhas = stdout.split("\n")
    
    for linha in linhas:
        if not linha:
            continue
            
        # O git status traz o status nos primeiros 2 caracteres (ex: 'M ', '?? ')
        # Pegamos apenas o caminho do arquivo a partir do índice 3
        caminho_arquivo = linha[3:].strip()
        
        # Remove aspas se o nome do arquivo tiver espaços
        caminho_arquivo = caminho_arquivo.strip('"\'')
        
        # Extrai apenas o nome do arquivo para usar na mensagem de commit
        nome_arquivo = os.path.basename(caminho_arquivo)
        mensagem_commit = f"Adiciona/Atualiza {nome_arquivo}"
        
        print(f"\n📦 Processando: {caminho_arquivo}")
        
        # 1. Dá o "check" no quadradinho (Adiciona para a área de stage)
        _, err_add = executar_comando(f'git add "{caminho_arquivo}"')
        if err_add:
            print(f"⚠️ Erro ao adicionar {caminho_arquivo}: {err_add}")
            continue
            
        # 2. Faz o commit individual daquele arquivo
        _, err_commit = executar_comando(f'git commit -m "{mensagem_commit}"')
        if err_commit:
            print(f"⚠️ Erro ao commitar {caminho_arquivo}: {err_commit}")
        else:
            print(f"✅ Commit realizado: '{mensagem_commit}'")

    print("\n🚀 Todos os arquivos foram commitados individualmente com sucesso!")

if __name__ == "__main__":
    fazer_commits_individuais()
