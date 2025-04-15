const express = require('express');
const axios = require('axios');
const mime = require('mime');
const cors = require('cors');
const { URL } = require('url');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const otherPath = '/archive';

let lastProtoHost;

// Habilitar CORS para todas as rotas
app.use(cors());

// Servir arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, '../dist')));

const regex = /\s+(href|src)=['"](.*?)['"]/g;
const cssUrlRegex = /url\(['"]?(.*?)['"]?\)/g;

/**
 * Gera uma nova URL com base no caminho da URL fornecida e na URL base
 */
const replaceUrl = (attribute, urlPath, req, baseUrl) => {
    let newUrl = '';
    if (urlPath.indexOf('http') !== -1) {
        newUrl = urlPath;
    } else if (urlPath.startsWith('//')) {
        newUrl = 'http:' + urlPath;
    } else {
        // Remove qualquer '../' do início do caminho da URL
        urlPath = urlPath.replace(/(\.\.\/)+/, '');
        const searchURL = new URL(baseUrl);
        let protoHost = searchURL.protocol + '//' + searchURL.host;
        newUrl = protoHost + `${otherPath}/` + urlPath;

        if (lastProtoHost != protoHost) {
            lastProtoHost = protoHost;
            console.log(`Usando '${protoHost}' como base para novas requisições.`);
        }
    }
    return attribute ? ` ${attribute}="${req.protocol}://${req.get('host')}/proxy?url=${newUrl}"` : newUrl;
};

const getMimeType = url => {
    if (url.indexOf('?') !== -1) { // remove url query para ter uma extensão limpa
        url = url.split("?")[0];
    }
    if (mime.getType(url) === 'application/x-msdownload') return 'text/html';
    return mime.getType(url) || 'text/html'; // se não houver extensão, retorna como html
};

// Rota para o proxy
app.get('/proxy', (req, res) => {
    const { url } = req.query; // obtém o parâmetro url
    if (!url) {
        res.type('text/html');
        return res.end("Você precisa especificar o parâmetro de consulta <code>url</code>");
    }

    axios.get(url, { 
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    })
    .then(({ data }) => {
        const urlMime = getMimeType(url); // obtém o tipo MIME da URL solicitada
        if (urlMime === 'text/html') { // substitui links apenas em html
            data = data.toString().replace(regex, (match, p1, p2) => {
                return replaceUrl(p1, p2, req, url);
            });
        } else if (urlMime === 'text/css') {
            // substitui o conteúdo css url()
            data = data.toString().replace(cssUrlRegex, (match, p1) => {
                const newUrl = replaceUrl(null, p1, req, url);
                return `url(${newUrl})`;
            });
        }
        res.type(urlMime);
        res.send(data);
    }).catch(error => {
        console.log(error);
        res.status(500);
        res.end("Erro ao acessar a URL: " + error.message)
    });
});

// Rota para recursos estáticos do site proxy
app.get(`${otherPath}/*`, (req, res) => {
    if (!lastProtoHost) {
        res.type('text/html');
        return res.end("Você precisa especificar o parâmetro de consulta <code>url</code> primeiro");
    }

    const url = lastProtoHost + req.originalUrl;
    axios.get(url, { 
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    })
    .then(({ data }) => {
        const urlMime = getMimeType(url); // obtém o tipo MIME da URL solicitada
        res.type(urlMime);
        res.send(data);
    }).catch(error => {
        res.status(501);
        res.end("Não implementado")
    });
});

// Rota para a página inicial - serve o index.html do React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`));
