# Tripleten web_project_around_express

Bootcamp Desenvolvimento Web - TripleTen

## Deploy

https://api.around.herisonpereira.com.br/

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- JavaScript
- Node
- Express
- MongoDB e Mongoose
- JWT
- Git e GitHub
- Deploy com VM Google Cloud

## 💻 Projeto

Projeto criado durante o bootcamp de desenvolvimento web da TripleTen, para validação de aprendizados de como criar uma API utilizando Node, Express e MongoDB com Mongoose.

## 🧪 Melhorias

Algumas melhorias que podem ser aplicadas:

- Criação de rota GET por ID de Card
- Possibilidade do usuário excluir sua conta

## ⚙ Instruções para rodar local

Primeiro faça o clone do repositório em seu computador.

Certifique-se de ter o Node em seu computador, na sua versão mais recente. Abra o terminal no diretório do repositório clonado e execute o comando para instalar todas as dependências:

```bash
npm install
```

Após todas dependências instaladas, execute o comando para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Se tudo deu certo, o servidor está pronto para uso.

URL Base: [http://localhost:3000](http://localhost:3000)

### 🚦 Rotas

Faça requisições concatenando a URL base `http://localhost:3000` ou `https://api.around.herisonpereira.com.br`

#### Auth

- `POST /signup`
- `POST /signin`

#### users

- `GET /users`
- `GET /users/{userId}`
- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/avatar`

#### cards

- `GET /cards`
- `POST /cards`
- `DELETE /cards/{cardId}`
- `PUT /cards/{cardId}/likes`
- `DELETE /cards/{cardId}/likes`
