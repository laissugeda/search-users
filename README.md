# 🔍 GitHub Search Explorer

Este projeto é uma aplicação moderna desenvolvida em **Angular 21** para busca de usuários e repositórios do GitHub.

---

## 🛠️ Tecnologias Principais

* **Framework:** Angular 21
* **Testes Unitários:** Vitest + JSDOM (executados via Angular CLI)
* **Testes E2E:** Cypress
* **Persistência:** Cache local via IndexedDB para otimizar requisições à API.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para preparar o ambiente:

### 1. Pré-requisitos

Certifique-se de ter instalado:

* **Node.js:** Versão 20 ou superior.
* **NPM:** Versão 11 ou superior.

### 2. Instalação

```bash
npm install

```

### 3. Rodar a aplicação

```bash
ng s

```

Acesse: [http://localhost:4200](http://localhost:4200)

---

## 🧪 Suíte de Testes e Resultados

Implementa uma estratégia de testes para garantir a estabilidade das funcionalidades principais.

### 1. Testes Unitários

Focam na lógica dos serviços e componentes de forma isolada, garantindo que o comportamento interno (como o tratamento de dados do GitHub) esteja correto.

* **Comando:** `ng test`
* **Onde ficam os resultados:** Os resultados são exibidos diretamente no terminal. O comando executa os specs utilizando o motor do Vitest configurado no ambiente Angular.

### 2. Testes End-to-End (Cypress)

Simulam a jornada real do usuário: digitar um login, clicar em buscar, validar o card e navegar até a lista de repositórios.

* **Comando para interface visual:** `npx cypress open`
* **Onde ficam os resultados:** Os resultados são visualizados em tempo real na interface gráfica do Cypress, onde é possível acompanhar cada passo da interação com o navegador.

---

## 🐞 Instruções para Debugging

Caso precise investigar o comportamento da aplicação:

### Debug da Interface e Cache

1. Abra o **DevTools** do navegador (`F12`).
2. Na aba **Application** > **Storage** > **IndexedDB**, você pode visualizar os dados salvos pelo `CacheService`. Isso ajuda a validar se a aplicação está recuperando dados do banco local antes de consultar a API externa.

### Debug de Testes

* **Testes Unitários:** O comando `ng test` roda em modo contínuo. Qualquer alteração no código reinicia os testes automaticamente, facilitando o rastreio de quebras.
* **Cypress:** Ao rodar com `npx cypress open`, você pode usar o "Time Travel" (disponível no Test Body) da ferramenta para clicar em cada etapa do teste e ver o estado exato da tela naquele momento.

---

## 📁 Estrutura do Projeto

* `src/app/services`: Lógica de API (`GitHubService`) e persistência (`CacheService`).
* `src/app/pages`: Componentes de página (Busca e Listagem).
* `src/app/components`: Componentes de interface reutilizáveis.
* `cypress/e2e`: Cenários de teste de ponta a ponta.

