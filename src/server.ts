import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import dotenv from 'dotenv';

import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Create GraphQL schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Apollo Server
  const apolloServer = new ApolloServer({
    schema,
    introspection: NODE_ENV === 'development',
  });

  // Start Apollo Server
  await apolloServer.start();

  // Mount Apollo middleware to Express
  app.use('/graphql', expressMiddleware(apolloServer));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', environment: NODE_ENV });
  });

  // Start HTTP server
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
      console.log(`📊 Environment: ${NODE_ENV}`);
      resolve();
    });
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
