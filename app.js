const express = require('express');
const app = express();
const PORT = 3000;

const { Client } = require('@notionhq/client');
const cors = require('cors');

require('dotenv').config();
const axios = require('axios');
const path = require('path'); 

const EBIRD_API_KEY = process.env.EBIRD_API_KEY;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/public', express.static('public'));


// Configura EJS como motor de visualização e define pasta de views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configura pasta pública para arquivos estáticos (CSS, imagens)
app.use(express.static(__dirname + '/public'));

// Importa as rotas das páginas
const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

// Rota para buscar pássaros pela localização
app.get('/birds', async (req, res) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
      return res.status(400).json({ error: 'Parâmetros de latitude e longitude são necessários.' });
  }
  
  try {
      const response = await axios.get(`https://api.ebird.org/v2/data/obs/geo/recent`, {
          params: { lat, lng },
          headers: {
              'X-eBirdApiToken': EBIRD_API_KEY
          }
      });
      
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao conectar com a API do eBird.' });
  }
});


/* ROTA INCLUIR EMAIL NO NOTION */

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

app.post('/api/submit-form', async (req, res) => {
    const { name, phone, email, country, tour } = req.body;

    if (!name || !phone || !email || !country || !tour) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: { title: [{ text: { content: name } }] },
                Phone: { phone_number: phone },
                Email: { email: email },
                Country: { rich_text: [{ text: { content: country } }] },
                Tour: { rich_text: [{ text: { content: tour } }] },
            },
        });

        res.status(200).send('Dados enviados para o Notion com sucesso!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar os dados no Notion.');
    }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


