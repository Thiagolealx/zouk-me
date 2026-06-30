# 🎶 Zouk - me

Controle de mensalidades de aulas de zouk — cadastro de alunos, controle mensal de pagamentos, divisão automática com sócio, e cobrança via WhatsApp (link manual).

Feito pra rodar como **app instalado no iPhone**, sem precisar de PC ligado no dia a dia.

---

## 🚀 Deploy (faça uma vez só)

### 1. Suba pro GitHub

```bash
cd zouk-me
git init
git add .
git commit -m "Zouk - me v1"
```

Crie um repositório novo no [github.com/new](https://github.com/new) (pode ser privado) e depois:

```bash
git remote add origin https://github.com/SEU_USUARIO/zouk-me.git
git branch -M main
git push -u origin main
```

### 2. Conecte na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `zouk-me`
4. A Vercel detecta automaticamente que é Vite — não precisa mudar nada
5. Clique em **Deploy**

Em ~1 minuto você recebe uma URL tipo:
```
https://zouk-me.vercel.app
```

Pronto — essa URL funciona pra sempre, de qualquer lugar, sem precisar do PC ligado.

---

## 📱 Instalar no iPhone

1. Abra a URL da Vercel **no Safari** (precisa ser Safari, não funciona no Chrome do iOS)
2. Toque no ícone de compartilhar (quadrado com seta pra cima)
3. Toque em **"Adicionar à Tela de Início"**
4. Confirme — aparece o ícone "Z" dourado na tela do iPhone

A partir daí abre como app, em tela cheia, sem barra de navegador.

---

## 💾 Sobre os dados

Os dados ficam salvos no **localStorage do Safari**, direto no iPhone. Funciona offline, sem internet, sem servidor.

**Atenção:** o iOS pode limpar dados de PWAs que ficam **7 dias sem serem abertos**. Use a aba **Alunos → Backup** para exportar um JSON de segurança de vez em quando (salve no Files do iPhone ou mande pra você mesmo).

---

## 💬 Cobrança via WhatsApp

Cada aluno pendente tem um botão **"📲 Cobrar"** que abre o WhatsApp já com a mensagem pronta (nome, mês, valor, Pix). Você confirma e envia manualmente — sem automação, sem risco de bloqueio de conta.

---

## 🔧 Rodar localmente (opcional, só se quiser editar)

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`

---

## 📁 Estrutura

```
zouk-me/
├── src/
│   ├── App.jsx       # App principal
│   └── main.jsx       # Entry point React
├── public/
│   ├── icon-192.png
│   └── icon-512.png
├── index.html
├── vite.config.js     # Config Vite + PWA
└── package.json
```

---

## ✉️ Pix configurado

Em `src/App.jsx`:
```js
const PIX_KEY = "thiago.lealx@gmail.com"
```
