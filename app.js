const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/auth");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(express.json());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 9000;

mongoose
  .connect(
    // `mongodb+srv://akash:${process.env.MONGO_PASSWORD}@cluster0.dqpor.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    `mongodb+srv://akash:event123456@cluster0.dqpor.mongodb.net/events-app?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Running");
    });
  })
  .catch((err) => console.log(err.stack));
