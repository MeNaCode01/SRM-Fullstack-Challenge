const express = require("express");
const cors = require("cors");
const { processHierarchies } = require("./processor");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data;
    if (!data || !Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Invalid input format. Expected { 'data': [...] }" });
    }

    const result = processHierarchies(data);

    const response = {
      user_id: "manav_aggarwal_01012000",
      email_id: "manav@example.com",
      college_roll_number: "123456789",
      ...result,
    };

    res.json(response);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
