# Megha Portões — site estático (GitHub Pages)

Site multipágina, sem build e sem dependências: HTML + CSS + JS puro.

## Como publicar no GitHub Pages (versão plana: todos os arquivos na raiz, sem pastas)
1. Crie um repositório e envie **todo o conteúdo desta pasta** (inclusive `.nojekyll`).
2. No GitHub: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
3. Em ~1 minuto o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
(Todos os caminhos são relativos, então funciona em subpasta ou domínio próprio.)

## Páginas
`index.html` início · `servicos.html` peças interativas · `orcamento.html` orçamento animado · `minha-area.html` área do cliente · `sobre.html` · `contato.html` · `404.html`

## O que editar
- **`config.js`** → telefones, endereço, Instagram, materiais, cores, extras, tamanhos e **PREÇOS**.
  ⚠️ Os preços são valores de exemplo. Troque pelos valores reais (`materiais.*.preco` = R$/m², `porMetro` = R$/metro, `extras`, `instalacao`).
- **`status.json`** → atualize o andamento dos pedidos (veja abaixo).
- **`assets/img` e `assets/video`** → fotos e vídeo (troque mantendo o mesmo nome).

## Como funciona o orçamento e a “Minha área”
O GitHub Pages não tem servidor/banco de dados, então:
- Ao finalizar, o pedido é **salvo no navegador do cliente** (localStorage) e aparece em *Minha área*.
- O cliente toca em **“Enviar pelo WhatsApp”** e a mensagem completa chega ao Carlito (`whatsPrincipal` no config.js). O envio só acontece quando o cliente toca no botão.
- Para o cliente ver o andamento, edite `status.json` direto no GitHub (ícone de lápis) usando o código do pedido:
  ```json
  "MP-261114-AB12": { "etapa": 2, "nota": "Medição sexta às 14h", "valorFinal": 4200, "previsao": "2026-12-05" }
  ```
  `etapa`: 0 Recebido · 1 Em análise · 2 Medição · 3 Produção · 4 Instalação · 5 Concluído. O cliente vê pela aba **Acompanhar por código**, de qualquer aparelho.
- Se quiser receber os pedidos automaticamente (e-mail/planilha) e ter login de verdade, dá para ligar um backend gratuito (Formspree, Supabase, Firebase). Peça e eu adapto.
