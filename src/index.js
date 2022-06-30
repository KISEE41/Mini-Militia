const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const data = JSON.parse(fs.readFileSync("./data.json"));

app.use(express.json());
app.use(cors());

app.put("/api/scoreboard", (req, res) => {
    data.push(req.body);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.json({
        status: "success",
        message: "Name and kills added.",
    });
});

app.get("/api/scoreboard", (req, res) => {
    res.json(data);
});

app.use(express.static('public'))

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});