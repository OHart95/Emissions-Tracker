const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/lookup", async (req, res) => {
  const { registration } = req.body;

  const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
    method: "POST",
    headers: {
      "x-api-key": "YOUR_API_KEY_HERE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ registrationNumber: registration })
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to fetch vehicle data from DVLA" });
  }

  const data = await response.json();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
