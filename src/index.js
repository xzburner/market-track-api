const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(cors({
  origin: '*',
  default: '*'
}));

app.all('*', function(req, res, next) {
  const origin = cors.origin.includes(req.header('origin').toLowerCase()) ? req.headers.origin : cors.default;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/historical-data', async (req, res) => {
  const { symbol, startDate, endDate } = req.query;

  if (!symbol || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Convertendo datas para timestamps Unix
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

    res.header('Content-Type', 'text/json');
    res.send(result);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance' });
  }
});

app.listen(port, () => {
  console.log(`Server running at port:${port}`);
});
