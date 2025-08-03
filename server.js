// server.js - DEBUG VERSION
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const PORT = process.env.PORT || 3000;

app.post("/optimize-product", async (req, res) => {
  const { productId, newDescription } = req.body;

  if (!productId || !newDescription) {
    console.log("❌ Fejl: productId eller newDescription mangler");
    return res.status(400).json({ error: "productId og newDescription er påkrævet" });
  }

  const url = `https://${SHOPIFY_DOMAIN}/admin/api/2023-07/products/${productId}.json`;
  console.log("🔹 Sender PUT-request til:", url);

  try {
    const response = await axios.put(
      url,
      { product: { id: productId, body_html: newDescription } },
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Shopify svar:", response.data);
    res.json({ success: true, product: response.data.product });

  } catch (error) {
    console.error("❌ Shopify fejl:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      shopifyError: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Debug server kører på http://localhost:${PORT}`);
});
