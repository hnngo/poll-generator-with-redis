const express = require("express");
const app = express();

// The HelloWorld
// app.get("/", (req, res) => {
//   res.send("Hello from Node.js!");
// });

app.get("/api", (req, res) => {
  res.send("Api links");
});


// app.get('/static', (req, res) => {
//   res.sendFile(path.resolve(__dirname, "views", "index.html"));
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
