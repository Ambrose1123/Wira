import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//making a rough data for backend
app.get("/ranking", (req, res) => {
  const data = [
    {
      id: 1,
      rank: 1,
      score: 95,
    },
    {
      id: 2,
      rank: 2,
      score: 90,
    },
    {
      id: 3,
      rank: 3,
      score: 85,
    },
    {
      id: 4,
      rank: 4,
      score: 80,
    },
    {
      id: 5,
      rank: 5,
      score: 75,
    },
    {
      id: 6,
      rank: 6,
      score: 70,
    },
    {
      id: 7,
      rank: 7,
      score: 65,
    },
    {
      id: 8,
      rank: 8,
      score: 60,
    },
    {
      id: 9,
      rank: 9,
      score: 55,
    },
    {
      id: 10,
      rank: 10,
      score: 50,
    },
    {
      id: 11,
      rank: 11,
      score: 45,
    },
    {
      id: 12,
      rank: 12,
      score: 40,
    },
    {
      id: 13,
      rank: 13,
      score: 35,
    },
    {
      id: 14,
      rank: 14,
      score: 30,
    },
    {
      id: 15,
      rank: 15,
      score: 25,
    },
  ];

  res.send(data);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
