const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors({ origin: true }));

app.get('/historical-data', async (req, res) => {
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
