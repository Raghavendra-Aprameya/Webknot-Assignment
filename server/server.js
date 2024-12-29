const app = require("./app");
const env = require("dotenv");

env.config();
const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
