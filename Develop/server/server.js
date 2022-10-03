import { ApolloServer } from 'apollo-server-express';
import express from "express"
import path from "path"
import db from './config/connection.js';
// import routes from './routes';
import { typeDefs, resolvers } from "./schemas/index.js"
import { authMiddleware } from './utils/auth.js';

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

server.applyMiddleware({app});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => 
  console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`use graphql at http://localhost:${PORT}${server.graphqlPath}`)
});
