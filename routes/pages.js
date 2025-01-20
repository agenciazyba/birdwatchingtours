const express = require('express');
const router = express.Router();

// Rota para a página inicial
router.get('/', (req, res) => {
  res.render('index', { title: 'Zybaoutdoors - Birdwatching tours' });
});

// Rotas para as outras páginas
router.get('/destinations', (req, res) => res.render('destinations'));
router.get('/about-us', (req, res) => res.render('about-us'));
router.get('/trips', (req, res) => res.render('trips'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/tour_extravaganza', (req, res) => res.render('tour_extravaganza'));
router.get('/tour_amazonfeathers', (req, res) => res.render('tour_amazonfeathers'));
router.get('/tour_mamiraua', (req, res) => res.render('tour_mamiraua'));
router.get('/tour_endemismhaven', (req, res) => res.render('tour_endemismhaven'));
router.get('/tour_endemismnorth', (req, res) => res.render('tour_endemismnorth'));
router.get('/tour_endemismsouth', (req, res) => res.render('tour_endemismsouth'));
router.get('/tour_roosevelt', (req, res) => res.render('tour_roosevelt'));
router.get('/tour_xingu', (req, res) => res.render('tour_roosevelt'));

module.exports = router;
