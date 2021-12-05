const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const db = require("./db");
const resolvers = require("./resolvers");
const { Server } = require("http");

const port = 9000;
const jwtSecret = Buffer.from("secret", "base64");

const auth = ({req}) => {
  const header = req.headers.authorization;
  console.log("AUTH HEADER", header)

  // not found
  if (!header) return { isAuth: false };

  // token
  const token = header.split(" ");

  // token not found
  if (!token) return { isAuth: false };

  let decodeToken;

  try {
    decodeToken = jwt.verify(token[1], jwtSecret);
  } catch (err) {
    return { isAuth: false };
  }

  // in case any error found
  if (!!!decodeToken) return { isAuth: false };

  // token decoded successfully, and extracted data
  return { user: decodeToken };
};

const app = express();
app.use(
  cors(),
  bodyParser.json()
);



const typeDefs = gql(fs.readFileSync("./schema.graphql", { encoding: "utf8" }));

//где в моем проекте apolloServer
// context: ({req}) => ({method: req.method})
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth
});
apolloServer.start().then((res) => {
  apolloServer.applyMiddleware({ app });
});
//todo не работает
// apolloServer.applyMiddleware({app, path: '/graphql'});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

app.listen(port, () =>
  console.info(`Server started on port ${port}` + apolloServer.graphqlPath)
);
