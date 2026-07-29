# 💱 Convert Money

Um conversor de moedas moderno e interativo, desenvolvido em JavaScript puro (ES Modules), consumindo cotações em tempo real da [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).

## 📌 Sobre o projeto

O **Convert Money** é uma aplicação web que permite converter valores entre diferentes moedas de forma simples, rápida e intuitiva.

O projeto nasceu como prática de front-end e foi evoluído com foco em boas práticas de engenharia de software: arquitetura modular, separação de responsabilidades e testes automatizados — pensado para servir como peça de portfólio.

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
- 🎯 Atualização automática da interface ao trocar a moeda selecionada
- ⚡ Cache de cotações (5 min) para evitar requisições desnecessárias à API
- ♿ Acessibilidade: labels associados aos campos, `aria-live` na região de resultado, teclado numérico no mobile
- 📱 Layout responsivo (mobile, tablet e desktop)

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES Modules)
- [Vitest](https://vitest.dev/) — testes unitários
- [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) — cotações de câmbio em tempo real

## 📁 Estrutura do projeto

```bash
Projeto/
├── index.html
├── style.css
├── package.json
├── vitest.config.js
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
│   ├── logo 10.png
│   └── background_currency_converter.png
└── src/
    ├── main.js            # Orquestra a aplicação e liga os eventos
    ├── api.js             # Comunicação com a AwesomeAPI + cache
    ├── formatters.js       # Funções puras: parsing, formatação e conversão
    ├── dom.js              # Única camada que manipula o DOM
    ├── currencyConfig.js   # Configuração central de cada moeda
    └── __tests__/
        ├── formatters.test.js
        └── api.test.js
```

Cada módulo tem uma responsabilidade única — isso separa lógica de negócio (testável sem navegador) de manipulação de tela, e facilita manutenção e testes.

## 💻 Como executar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/AthillaDev/projeto-currency-converter
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd projeto-currency-converter
   ```
3. Como o projeto usa **ES Modules**, ele precisa ser servido por um servidor local (abrir o `index.html` direto via `file://` não funciona por restrição de CORS). Use uma das opções:
   ```bash
   npx serve .
   ```
   ou a extensão **Live Server** do VS Code.

## 🧪 Rodando os testes

```bash
npm install
npm test
```

Os testes cobrem as funções de parsing/formatação/conversão (`formatters.js`) e a camada de comunicação com a API, incluindo cache e tratamento de erros (`api.js`), com o `fetch` mockado — sem depender de rede real.

## 🌐 Deploy

https://athilladev.github.io/projeto-currency-converter/

## 💡 Melhorias futuras

- 🔁 Botão de inverter moedas (from ↔ to)
- 📊 Histórico de conversões (localStorage)
- 📈 Gráfico de variação da cotação (dados históricos da AwesomeAPI)
- 🌙 Dark mode
- 🔒 Migração para TypeScript
- 📦 PWA (instalável)

## 📸 Preview

<img src="https://raw.githubusercontent.com/AthillaDev/projeto-currency-converter/f4362328405ae327091d1da71837c631886e4891/assets/Preview%20logo%20conversor.png.png" />

## 👨‍💻 Autor

Desenvolvido por **AthillaDev** 🚀

✨ Projeto criado para estudo e desenvolvimento de habilidades em front-end e boas práticas de engenharia de software.


