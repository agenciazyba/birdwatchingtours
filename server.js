const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { Client } = require('@notionhq/client');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// Chaves da API
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;


// Middleware para arquivos estáticos e JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors()); // Habilita CORS caso precise consumir APIs externamente

// Middleware
app.use(bodyParser.json());

// Configura EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Importa e usa as rotas das páginas
const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

// Instância do cliente Notion
const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Rota para enviar dados para o Notion
 */
app.post('/api/submit-form', async (req, res) => {
    const { name, phone, email, country, tour } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !phone || !email || !country || !tour) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Cria uma nova página no Notion com os dados enviados
        await notion.pages.create({
            parent: { database_id: NOTION_DATABASE_ID },
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

// Exporta o app para uso no Vercel
module.exports = app;



// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});