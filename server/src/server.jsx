const app = require("./app.jsx");
const connectDataBase = require("./config/db.jsx");
const { serverPort } = require("./secret.jsx");

app.listen(serverPort, async () => {
  console.log(`server is running at http://localhost:${serverPort}`);
  await connectDataBase();
});
