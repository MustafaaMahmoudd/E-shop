const dotenv = require("dotenv").config({ path: "./config.env" });
const app = require("./app/app");
const port = process.env.PORT;


const server = app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
