<h1 align="center">Siscop - Inventory</h1>

### ✨ Sobre

<h4>Parte de Estoque do microfrontend desenvolvido para o Hackathon da Pós Tech FIAP</h4>

<b>Versão:</b> 1.0.0

### 📌 Stack de Desenvolvimento

- [React](https://react.dev/) — biblioteca principal para construção da interface;
- [Vite](https://vite.dev/) — ferramenta de build e bundler ultrarrápido;
- [@mui/material](https://mui.com/material-ui/) — biblioteca de componentes para construção de formulários e telas;
- [@phosphor-icons/react](https://phosphoricons.com/) — conjunto de ícones utilizados na interface;
- [agro-core](https://www.npmjs.com/package/agro-core) — design system para padronização de cores e estilos;
- [Firebase](https://firebase.google.com) — backend como serviço (BaaS) para autenticação, banco de dados e hospedagem;
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction/) — sistema de notificações e alertas;
- [date-fns](https://date-fns.org/) — para lidar com datas;
- [@module-federation/vite](https://github.com/module-federation/vite) — integração de Module Federation para arquitetura de microfrontends.

### 🛠️ Ferramentas de Desenvolvimento
- IDE: [VSCode](https://code.visualstudio.com/)

---

### 🔧 Configurações do Firebase

<b>1. Criar conta</b>

  - Crie uma conta ou [acesse o console](https://console.firebase.google.com/) do Firebase usando sua conta Google.

<b>2. Criar um novo projeto no Firebase</b>

  - Siga este [guia oficial](https://firebase.google.com/docs/web/setup) para criar um novo projeto.
  - Após criar o projeto, acesse a aba Configurações do Projeto (ícone de engrenagem no menu lateral).
  - Na seção Suas Apps, clique em "Web" para registrar uma nova aplicação Web.
  - Ao finalizar o registro, o Firebase irá exibir o seu Firebase Config — um objeto contendo informações como apiKey, projectId, storageBucket, entre outros.

<b>3. Configuração do ambiente</b>

  1. Crie um arquivo chamado `.env` na raiz do projeto.

  2. Copie e preencha a estrutura abaixo com os dados fornecidos pelo Firebase:

   ```js
    // .env

    VITE_FIREBASE_API_KEY={{ API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN={{ DOMINIO.firebaseapp.com }}
    VITE_FIREBASE_PROJECT_ID={{ PROJECT_ID }}
    VITE_FIREBASE_STORAGE_BUCKET={{ BUCKET.appspot.com }}
    VITE_FIREBASE_MESSAGING_SENDER_ID={{ SENDER_ID }}
    VITE_FIREBASE_APP_ID={{ APP_ID }}
  ```

  3. Um arquivo de exemplo chamado ```.env.example``` está disponível no projeto. Use-o como base para criar o seu arquivo de configuração:

  ```bash
  cp .env.example .env
  ```

<b>4. Habilitar Autenticação e Firestore</b>

  No console do Firebase, acesse:

  - [Autenticação](https://firebase.google.com/docs/auth/web/email-link-auth): Habilite o método de email/senha e o login com o google para autenticação.
  - [Firestore](https://firebase.google.com/docs/firestore/quickstart): Crie um banco de dados Firestore.

<b>5. Configurar regras do Firestore</b>

  No Firestore, adicione as [regras de acesso](https://firebase.google.com/docs/firestore/security/get-started) abaixo (configuração disponível na aba de "Regras"):
  ```bash
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
  ```

<b>6. Criar índices para consultas</b>

  - Este projeto utiliza de consultas compostas para as notificações, por isso você precisará [criar índices](https://firebase.google.com/docs/firestore/query-data/indexing) no Firestore. Isso pode ser feito diretamente pelo console (configuração disponível na aba de "Índices") ou seguindo as mensagens de erro que o Firestore retorna no log da aplicação.
  - Este são os índices do projeto:

  <table>
    <thead>
      <tr>
        <th>ID da coleção</th>
        <th>Campos indexados</th>
        <th>Escopo da consulta</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>sales</td>
        <td>farm_id (Crescente), created_at (Crescente), __name__ (Crescente)</td>
        <td>Coleta</td>
        <td>Ativado</td>
      </tr>
      <tr>
        <td>inventory</td>
        <td>farm_id (Crescente), state (Crescente), created_at (Crescente), __name__ (Crescente)</td>
        <td>Coleta</td>
        <td>Ativado</td>
      </tr>
      <tr>
        <td>goals</td>
        <td>farm_id (Crescente), finished (Decrescente), kind (Crescente) ,created_at (Crescente), __name__ (Decrescente)</td>
        <td>Coleta</td>
        <td>Ativado</td>
      </tr>
    </tbody>
  </table>

---

### 🎯 Getting Started

Instalar as dependências

```bash
npm install
```

Iniciar projeto no modo dev:

```bash
npm run dev
```

Com o projeto rodando, abra [http://localhost:3003](http://localhost:3003) com seu navegador.

Para rodar os testes, rode o seguinte comando:

```bash
npm run test
```