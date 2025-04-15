const axios = require('axios');
const mime = require('mime');
const { URL } = require('url');

// Constante personalizada, você pode alterá-la para o que quiser
const otherPath = '/archive';

let lastProtoHost;

const regex = /\s+(href|src)=['"](.*?)['"]/g;
/**
 * Esta regex é usada para corresponder à função url() do CSS
 * É usada para resolver imagens de fundo ou quaisquer outras imagens em CSS
 */
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
    return attribute ? ` ${attribute}="${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/proxy?url=${newUrl}"` : newUrl;
};

const getMimeType = url => {
    if (url.indexOf('?') !== -1) { // remove url query para ter uma extensão limpa
        url = url.split("?")[0];
    }
    if (mime.getType(url) === 'application/x-msdownload') return 'text/html';
    return mime.getType(url) || 'text/html'; // se não houver extensão, retorna como html
};

exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    // Lidar com solicitações OPTIONS (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const url = event.queryStringParameters.url;
        
        if (!url) {
            return {
                statusCode: 400,
                headers,
                body: "Você precisa especificar o parâmetro de consulta 'url'"
            };
        }

        // Verificar se é uma solicitação de arquivo
        if (event.path.startsWith('/archive/')) {
            if (!lastProtoHost) {
                return {
                    statusCode: 400,
                    headers,
                    body: "Você precisa especificar o parâmetro de consulta 'url' primeiro"
                };
            }

            const archivePath = event.path.replace('/archive/', '');
            const fileUrl = lastProtoHost + archivePath;
            
            const response = await axios.get(fileUrl, { 
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const urlMime = getMimeType(fileUrl);
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': urlMime
                },
                body: response.data.toString('base64'),
                isBase64Encoded: true
            };
        }

        // Solicitação principal
        const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const urlMime = getMimeType(url);
        let data = response.data;
        
        if (urlMime === 'text/html') {
            // Substituir links apenas em HTML
            data = data.toString().replace(regex, (match, p1, p2) => {
                return replaceUrl(p1, p2, event, url);
            });
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': urlMime
                },
                body: data
            };
        } else if (urlMime === 'text/css') {
            // Substituir o conteúdo css url()
            data = data.toString().replace(cssUrlRegex, (match, p1) => {
                const newUrl = replaceUrl(null, p1, event, url);
                return `url(${newUrl})`;
            });
            
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': urlMime
                },
                body: data
            };
        } else {
            // Para outros tipos de conteúdo, retornar como está
            return {
                statusCode: 200,
                headers: {
                    ...headers,
                    'Content-Type': urlMime
                },
                body: response.data.toString('base64'),
                isBase64Encoded: true
            };
        }
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erro ao acessar a URL: ' + error.message })
        };
    }
};
