const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // <-- This line

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/lookup', async (req, res) => {
  const { registration } = req.body;

  if (!registration) {
    return res.status(400).json({ error: 'Missing registration number' });
  }

  try {
    const response = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
      method: 'POST',
      headers: {
        'x-api-key': 'L8jXvotxkH4nRkHwMxQzJ8OHtEOgct4Z16uSByWV',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ registrationNumber: registration })
    });

    const data = await response.json();

    if (!response.ok) {
  const errorText = await response.text(); // get raw response text
  console.error('DVLA API error status:', response.status, 'response:', errorText);
  return res.status(response.status).json({ error: errorText });
}


    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
