// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Hent API-nøgle fra miljøvariabler
const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN; 
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

const PORT = process.env.PORT || 3000;

// Endpoint til at opdatere produktbeskrivelse
app.post("/optimize-product", async (req, res) => {
  const { productId, newDescription } = req.body;

  if (!productId || !newDescription) {
    return res.status(400).json({ error: "productId og newDescription er påkrævet" });
  }

  try {
    const response = await axios.put(
      `https://${SHOPIFY_DOMAIN}/admin/api/2023-07/products/${productId}.json`,
      {
        product: { id: productId, body_html: newDescription },
      },
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, product: response.data.product });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server kører på http://localhost:${PORT}`);
});
