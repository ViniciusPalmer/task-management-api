# 📋 Task Manager API

API desenvolvida em **Node.js** para gerenciamento completo de tarefas (CRUD), com suporte a importação em massa via arquivo CSV.

## 🚀 Sobre o Projeto

Esta API permite criar, listar, atualizar, remover e marcar tarefas como concluídas.  
O principal diferencial é a funcionalidade de **importação em massa de tarefas a partir de um arquivo CSV**, utilizando a biblioteca `csv-parse`.

Este projeto foi desenvolvido como desafio de estudo para praticar conceitos de:

- Node.js
- APIs REST
- Manipulação de arquivos
- Streams
- Estrutura de dados
- Boas práticas de organização de código

---

## ▶️ Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/ViniciusPalmer/task-management-api.git
```

### 2. Entrar na pasta

```bash
cd task-management-api
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Executar o servidor

```bash
npm run dev
```

## 🧩 Funcionalidades

- Criar uma nova tarefa
- Listar tarefas
  - Filtro por **título**
  - Filtro por **descrição**
- Atualizar tarefa
- Remover tarefa
- Marcar tarefa como concluída
- Importar tarefas em massa via CSV

---

## 🛠 Tecnologias Utilizadas

- Node.js
- JavaScript
- csv-parse
- HTTP nativo / Express (ajustar conforme seu projeto)

---

## 📂 Estrutura do Projeto (Exemplo)

```txt
📦src
┣ 📂middlewares
┃ ┗ 📜json.js
┣ 📂models
┃ ┗ 📜task.js
┣ 📂routes.js
┃ ┗ 📜task-management-routes.js
┣ 📂utils
┃ ┣ 📜build-route-path.js
┃ ┗ 📜extract-query-params.js
┣ 📜database.js
┗ 📜server.js
```

---

## Rotas

- `POST /tasks`: cria uma tarefa usando JSON com `title` e `description`
- `GET /tasks`: lista tarefas (opcional `search`)
- `PUT /tasks/:id`: atualiza uma tarefa
- `PATCH /tasks/:id/complete`: marca como concluida
- `DELETE /tasks/:id`: remove uma tarefa
- `POST /tasks/import`: importa tarefas em massa via CSV

### Importacao via CSV

Envie o arquivo no corpo da requisicao com `Content-Type: text/csv`.

Formato esperado (com cabecalho):

```csv
title;description
Comprar leite;Ir ao mercado
Estudar Node;Revisar streams e HTTP
```

Resposta de sucesso:

```json
{ "imported": 2 }
```
