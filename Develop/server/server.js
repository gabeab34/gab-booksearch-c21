const { ApolloServer } = require( 'apollo-server-express');
const express = require( "express");
const path = require( "path");
const db = require( './config/connection.js');
const  {typeDefs, resolvers} = require ("./schemas");
const  {authMiddleware}  =require( './utils/auth.js');


const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'))
})

const Apollo = async (typedefs, resolvers) => {
  await server.start();
  server.applyMiddleware({app});


  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(`use graphql at http://localhost:${PORT}${server.graphqlPath}`)
    })
  })
};

Apollo(typeDefs, resolvers);