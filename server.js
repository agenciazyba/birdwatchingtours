const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verificação de variáveis de ambiente
if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.error("Erro: Variáveis de ambiente 'NOTION_API_KEY' e 'NOTION_DATABASE_ID' são obrigatórias.");
    process.exit(1);
}

// Instância do cliente Notion
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Middleware para arquivos estáticos, JSON e CORS
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas da aplicação
const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

/**
 * Rota para enviar dados ao Notion
 */
app.post('/api/submit-form', async (req, res) => {
    const { name, phone, email, country, tour } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !phone || !email || !country || !tour) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Criação da página no Notion
        await notion.pages.create({
            parent: { database_id: process.env.NOTION_DATABASE_ID },
            properties: {
                Name: { title: [{ text: { content: name } }] },
                Phone: { phone_number: phone },
                Email: { email: email },
                Country: { rich_text: [{ text: { content: country } }] },
                Tour: { rich_text: [{ text: { content: tour } }] },
            },
        });

        res.status(200).json({ message: 'Dados enviados para o Notion com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar dados no Notion:', error.message);
        res.status(500).json({ error: 'Erro ao salvar os dados no Notion.' });
    }
});

// Inicia o servidor localmente apenas se não estiver no Vercel
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

// Exporta o app para uso no Vercel
module.exports = app;
