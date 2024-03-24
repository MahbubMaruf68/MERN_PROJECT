const app = require("./app.jsx");
const { serverPort } = require("./secret.jsx");

app.listen(serverPort, () => {
  console.log(`server is running at http://localhost:${serverPort}`);
});
