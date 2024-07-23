const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');

const allowedOrigins = ['https://main.db36k3o59f71n.amplifyapp.com', 'http://localhost:4200']; // Adicione todas as origens permitidas aqui
const defaultOrigin = 'https://main.db36k3o59f71n.amplifyapp.com'; // Valor padrão

app.use((req, res, next) => {
  const origin = allowedOrigins.includes(req.headers.origin) ? req.headers.origin : defaultOrigin;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(cors());


app.get('/historical-data', cors(), async (req, res) => {
  const { symbol, startDate, endDate } = req.query;

  if (!symbol || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date(endDate).getTime() / 1000);

    const response = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/' + symbol, {
      params: {
        period1,
        period2,
        interval: '1d',
        events: 'history'
      },
      responseType: 'text'
    });

    const result = JSON.parse(response.data);

    res.header('Content-Type', 'application/json');
    res.send(result);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance' });
  }
});

app.listen(port, () => {
  console.log(`Server running at port:${port}`);
});
