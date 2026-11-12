# CM Marketing Digital

Landing page da Camila Machado em React + Vite. Projeto local em `E:\CM_MarketingDigital`.

## Executar

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. `npm run build` gera `dist/`. `npm test` verifica a validação e o contrato da API sem enviar leads reais.

## Configuração

Copie `.env.example` para `.env` e preencha `MAKE_WEBHOOK_URL`. `MAKE_APPLICATION_ID` é opcional, caso o cenário do Make exija identificação da aplicação como na VIS. Reinicie o Vite após alterar as variáveis.

O frontend usa Axios para enviar `POST /api/contact`; a API valida os dados e envia o lead ao Make com `name`, `phone`, `email`, `service`, `message`, `source`, `language`, `createdAt` e, se configurado, `applicationId`. Os serviços têm valores estáveis `strategy`, `social-media` e `paid-ads`.

O cenário deve retornar `Accepted`, JSON `{ "ok": true }` ou HTTP 204. Respostas ambíguas e erros não limpam o formulário nem mostram sucesso. Sem webhook, a API retorna indisponibilidade e orienta o visitante a usar WhatsApp. O webhook nunca deve usar prefixo `VITE_`, pois esse prefixo expõe valores ao navegador.

O telefone público (55 11 97854-9530), Instagram e retrato foram obtidos de https://lpmktdigitalcm.my.canva.site/, indicado pelo proprietário. A foto está em `public/camila.webp`; pode ser substituída diretamente ou por `VITE_CAMILA_PHOTO_URL`. As fontes Poppins e DM Sans são servidas localmente.

## Publicação

Não foi realizada publicação. Para Vercel, use o preset Vite, saída `dist`, e configure as variáveis de servidor no painel: `api/contact.js` é uma função no formato Vercel. Em outro provedor, hospede/adapte essa função em um backend Node e encaminhe `/api/contact` para ela. Hospedar apenas a pasta `dist` não disponibiliza a API. `npm run preview` serve apenas a versão estática; use `npm run dev` para testar o formulário localmente.

Antes de abrir campanhas, configure o cenário Make, teste a conversão real em lead e aplique limitação de requisições no provedor da API. O honeypot é uma proteção básica, não substitui limitação de abuso.

## Interface
 
A imagem `public/og-image.jpg` tem 1200 × 630 px. As tags Open Graph e Twitter Card estão no HTML inicial, sem depender do React. O Vite preenche `og:image`, `twitter:image`, `og:url` e `canonical` no build.

Na Vercel, configure `SITE_URL` com a URL pública definitiva (incluindo `https://`) e faça um novo deploy. Sem essa variável, são usados `VERCEL_PROJECT_PRODUCTION_URL` ou `VERCEL_URL`, quando disponíveis. Localmente, a imagem usa caminho relativo e não há canonical fictício. Previews da Vercel recebem `noindex, nofollow`. O compartilhamento está em português; trocar o idioma no navegador não altera a prévia dos robôs.

Imagem criada com ImageGen integrado. Prompt completo: `docs/og-image-prompt.txt`. Referência do protocolo: https://ogp.me/.

- Wireframe e paleta baseados no PDF fornecido, com Sol de Maio em SVG e foto real.
- PT, ES e EN, com idioma persistido e atributo `lang` atualizado.
- Temas claro/escuro persistidos, respeitando a preferência do sistema na primeira visita.
- Menu mobile, contato expansível (WhatsApp e Instagram) e voltar ao topo à esquerda após 600 px.
- AOS respeita movimento reduzido; Toastify informa validação, envio, sucesso e erros com emojis.
- Campos com labels, erros associados, foco visível e fechamento dos menus por Escape ou clique externo.

Referência de setup: https://vite.dev/guide/.
