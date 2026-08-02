# 💱 Trocca

**Câmbio simples. Na hora certa.**

Um conversor de moedas moderno, interativo e instalável (PWA), desenvolvido em JavaScript puro (ES Modules), consumindo cotações em tempo real da [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).

## 📌 Sobre o projeto

**Trocca** é uma aplicação web que permite converter valores entre diferentes moedas de forma simples, rápida e intuitiva.

O projeto nasceu como prática de front-end e foi evoluído com foco em boas práticas de engenharia de software: arquitetura modular, separação de responsabilidades, testes automatizados e progressivamente enriquecido com histórico, visualização de dados e suporte offline — pensado para servir como peça de portfólio.

## 🚀 Funcionalidades

- 💱 Conversão entre múltiplas moedas:
  - Real (BRL)
  - Dólar Americano (USD)
  - Euro (EUR)
  - Libra Esterlina (GBP)
  - Bitcoin (BTC)
  - Renminbi Chinês (CNY)
  - Iene Japonês (JPY)
- 🔄 Conversão dinâmica, com cotações reais buscadas em tempo real
- 🔁 Botão de inverter moedas (origem ↔ destino), com atalho de swipe no mobile
- ⌨️ Máscara de valor monetário em tempo real + atalho de teclado (Enter)
- 🔢 Chips de valores rápidos (100 / 500 / 1.000 / 10.000)
- 📋 Copiar valor convertido com um clique
- 📈 Indicador de tendência (alta/baixa/estável) e horário da última cotação
- 📊 Gráfico de variação da cotação (últimos 15 dias)
- 🕘 Histórico das últimas conversões (persistido localmente)
- 🌙 Dark mode, com persistência de preferência
- 📲 PWA — instalável, com suporte offline via Service Worker
- ⚡ Cache de cotações (5 min) para evitar requisições desnecessárias à API
- ♿ Acessibilidade: labels associados aos campos, `aria-live` na região de resultado, `prefers-reduced-motion` respeitado
- 📱 Layout responsivo (mobile, tablet e desktop)

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3 (custom properties para theming)
- JavaScript (ES Modules)
- Canvas API (gráfico de variação, sem bibliotecas externas)
- Service Worker + Web App Manifest (PWA)
- [Vitest](https://vitest.dev/) — testes unitários
- [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) — cotações de câmbio em tempo real e histórico

## 📁 Estrutura do projeto

```bash
Projeto/
├── index.html
├── style.css
├── package.json
├── vitest.config.js
├── manifest.json          # Configuração do PWA
├── service-worker.js      # Cache offline (estratégia mista)
├── README.md
├── assets/
│   ├── REAL.png
│   ├── DOLAR.png
│   ├── EURO.png
│   ├── LIBRA.png
│   ├── BITCOIN.png
│   ├── CHINA.png
│   ├── JAPAO.png
│   ├── Seta.png
│   ├── icon-192.png        # Ícone do PWA
│   ├── icon-512.png        # Ícone do PWA
│   └── background_currency_converter.png
└── src/
    ├── main.js            # Orquestra a aplicação e liga os eventos
    ├── api.js             # Comunicação com a AwesomeAPI + cache + tendência + histórico
    ├── formatters.js       # Funções puras: parsing, formatação e conversão
    ├── dom.js              # Única camada que manipula o DOM
    ├── theme.js            # Controle de dark/light mode
    ├── inputMask.js        # Máscara de valor monetário em tempo real
    ├── clipboard.js         # Copiar valor pra área de transferência
    ├── swipeGesture.js      # Detecção de gesto de swipe (mobile)
    ├── history.js           # Histórico de conversões (localStorage)
    ├── chart.js             # Gráfico de variação (canvas puro)
    ├── currencyConfig.js   # Configuração central de cada moeda
    └── __tests__/
        ├── formatters.test.js
        └── api.test.js
```

## 💻 Como executar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/AthillaDev/projeto-currency-converter
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd projeto-currency-converter
   ```
3. Como o projeto usa **ES Modules** e **Service Worker**, ele precisa ser servido por um servidor local (abrir o `index.html` direto via `file://` não funciona). Use uma das opções:
   ```bash
   npx serve .
   ```
   ou a extensão **Live Server** do VS Code.

## 🧪 Rodando os testes

```bash
npm install
npm test
```

## 🌐 Deploy

https://projeto-currency-converter.vercel.app/

## 🚦 Lighthouse Audit

Auditoria rodada em produção (Vercel) em 02/08/2026:

| Categoria | Mobile | Desktop |
|---|---|---|
| Performance | 64 → *em otimização* | 83 |
| Acessibilidade | 96 | 96 |
| Práticas recomendadas | 92 | 96 |
| SEO | 100 | 100 |

**Correções já aplicadas a partir da auditoria:**
- ✅ Contraste de texto ajustado pra atender WCAG AA (4.5:1) nos textos secundários
- ✅ Atributos `width`/`height` adicionados nas imagens, reduzindo layout shift (CLS)

**Melhoria pendente identificada:**
- 🔧 Compressão das imagens estáticas (`background_currency_converter.png` e ícones de moeda) — a auditoria estimou ~2.6 MB de economia possível. É o maior gargalo de performance no mobile hoje, causado pelo peso das imagens originais em conexões mais lentas.

## 💡 Melhorias futuras

- 🌍 Mais moedas disponíveis
- 🎨 Skeleton loading mais elaborado
- 🔔 Notificação de variação relevante (via Push API)

## 📸 Preview

![Preview do Trocca](./assets/screen.png)

## 👨‍💻 Autor

Desenvolvido por **AthillaDev** 🚀

- GitHub: [github.com/AthillaDev](https://github.com/AthillaDev)
- LinkedIn: [linkedin.com/in/athillacruz](https://www.linkedin.com/in/athillacruz)
- Portfólio: [meu-portfolio-athilla-dev.vercel.app](https://meu-portfolio-athilla-dev.vercel.app/)

✨ Projeto criado para estudo e desenvolvimento de habilidades em front-end e boas práticas de engenharia de software.
