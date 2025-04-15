# CyberCode - Gerador de Código Seguro

Este projeto implementa um gerador de código de segurança com uma interface estética "hacker", utilizando React e TailwindCSS. O design segue um tema escuro com detalhes em neon (verde/azul) e uma animação de matriz (estilo Matrix) no background para criar uma atmosfera cibernética e tecnológica.

## Funcionalidades

- Geração do código de segurança específico "H785X" com animação
- Animações visuais durante o processo de geração
- Botão para copiar o código para a área de transferência
- Acesso à corretora através de iframe com bypass de X-Frame-Options
- Notificações de saques com valores e nomes aleatórios
- Design responsivo para diferentes tamanhos de tela

## Tecnologias Utilizadas

- React com TypeScript
- TailwindCSS para estilização
- Express para o servidor proxy
- Netlify para hospedagem

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```
git clone https://github.com/fiverlaine/cybercode.git
cd cybercode
```

2. Instale as dependências:
```
npm install
```

3. Instale as dependências do servidor proxy:
```
cd server
npm install
cd ..
```

4. Instale as dependências das funções Netlify:
```
cd functions
npm install
cd ..
```

### Execução em Desenvolvimento

Para executar o projeto em modo de desenvolvimento com o servidor proxy:

```
npm run start
```

Este comando iniciará tanto o servidor de desenvolvimento do Vite quanto o servidor proxy.

### Build para Produção

Para criar uma versão de produção:

```
npm run build
```

Os arquivos de build serão gerados na pasta `dist`.

## Deploy na Netlify

Este projeto está configurado para ser facilmente implantado na Netlify:

1. Faça o fork deste repositório para sua conta GitHub
2. Acesse a Netlify e crie uma nova aplicação a partir do repositório GitHub
3. Configure as opções de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Clique em "Deploy site"

A Netlify detectará automaticamente as funções serverless na pasta `functions` e as implantará.

## Estrutura do Projeto

- `src/` - Código fonte do frontend React
- `server/` - Servidor proxy para desenvolvimento local
- `functions/` - Funções serverless para a Netlify
- `public/` - Arquivos estáticos
- `dist/` - Arquivos de build (gerados)

## Licença

MIT
