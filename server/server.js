const env = require("dotenv");
env.config();
console.log("first");
const app = require("./app");

const port = process.env.PORT || 8001;
console.log("Second");
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
