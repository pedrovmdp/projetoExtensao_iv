# 🧭 Git Workflow - Projeto Instituto Díomicio Freitas

Este documento define o fluxo de trabalho adotado neste repositório, baseado no **GitHub Flow**, com padronização de *commits* semânticos e diretrizes para revisão e integração de código.

---

## 📌 Estrutura de Branches

Utilizamos uma estrutura simples baseada no GitHub Flow:

- `main`: branch principal. Sempre reflete o estado **pronto para produção**.
- `feature/<nome>`: para desenvolvimento de novas funcionalidades.
- `fix/<nome>`: para correção de bugs.
- `hotfix/<nome>`: correções urgentes diretamente em produção (com pull request).
- `docs/<nome>`: alterações exclusivamente na documentação.

**Exemplos:**
- `feature/cardapio-digital`
- `fix/erro-nutricional`
- `docs/workflow-md`

---

## 🔄 Regras de Atualização

1. Sempre **criar uma branch a partir da `main`** para qualquer alteração.
2. Antes de abrir um *pull request*, **atualize sua branch com a `main`**:
   ```bash
   git checkout main
   git pull origin main
   git checkout sua-branch
   git merge main
   git merge --squash

3. Resolva conflitos localmente, se houver.
4. Mantenha commits limpos e organizados.

---
## 🔍 Política de Revisão e Integração

- Todo código deve ser submetido via Pull Request (PR).

- Revisão obrigatória por pelo menos 1 membro da equipe antes do merge.

- Revisores devem verificar:

- Clareza e objetivo do código

- Cobertura e validade de testes (se aplicável)

- Conformidade com os padrões de estilo

- Após aprovação, o autor pode fazer o merge com squash, para manter o histórico limpo:

    ```bash
    git merge --squash
---
## ✍️ Padronização de Commits Semânticos

### Formato:
- <tipo>(escopo opcional): descrição breve no imperativo

### Exemplos:

- feat(cardapio): adicionar seção de informações nutricionais
- fix(css): corrigir alinhamento da lista de alimentos
- docs(workflow): adicionar política de revisão

## ✅ Tipos de Commits Aceitos

| Tipo       | Descrição                                                      |
| ---------- | -------------------------------------------------------------- |
| `feat`     | Nova funcionalidade                                            |
| `fix`      | Correção de bugs                                               |
| `docs`     | Alterações na documentação                                     |
| `style`    | Mudanças que não afetam a lógica (ex: formatação, indentação)  |
| `refactor` | Refatoração de código (sem novas funcionalidades ou correções) |
| `test`     | Adição ou alteração de testes                                  |
| `chore`    | Tarefas administrativas ou de build                            |
| `ci`       | Configurações de integração contínua                           |
| `perf`     | Melhorias de performance                                       |


## 🔥 Tipos Inéditos (Customizados para o projeto):

| Tipo     | Descrição                                                          |
| -------- | ------------------------------------------------------------------ |
| `menu`   | Atualizações específicas no cardápio ou itens alimentares          |
| `layout` | Mudanças estruturais de HTML/CSS que afetam o layout visual        |
| `access` | Melhorias em acessibilidade (ex: contraste, navegação por teclado) |

 
## 🚀 Boas Práticas

- Faça commits pequenos e frequentes.

- Use mensagens claras e objetivas.

- Abra PRs com títulos e descrições informativas.

- Comente o que for relevante para facilitar a revisão.

## 📬 Dúvidas?

Em caso de dúvidas, entre em contato com os mantenedores do projeto ou consulte os exemplos de commits anteriores.
