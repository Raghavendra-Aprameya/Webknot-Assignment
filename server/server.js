const env = require("dotenv");
env.config();

const app = require("./app.js");

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
