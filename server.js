require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const EBIRD_API_KEY = process.env.EBIRD_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rota para buscar pássaros pela localização
app.get('/birds', async (req, res) => {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Parâmetros de latitude e longitude são necessários.' });
    }
    
    try {
        const response = await axios.get(`ttps://api.ebird.org/v2/data/obs/PT/recent/notable?detail=full`, {
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
