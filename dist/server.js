"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const http_1 = require("http");
const schema_1 = require("@graphql-tools/schema");
const dotenv_1 = __importDefault(require("dotenv"));
const typeDefs_1 = require("./schema/typeDefs");
const resolvers_1 = require("./resolvers");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
async function startServer() {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    // Middleware
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    // Create GraphQL schema
    const schema = (0, schema_1.makeExecutableSchema)({
        typeDefs: typeDefs_1.typeDefs,
        resolvers: resolvers_1.resolvers,
    });
    // Apollo Server
    const apolloServer = new server_1.ApolloServer({
        schema,
        introspection: NODE_ENV === 'development',
    });
    // Start Apollo Server
    await apolloServer.start();
    // Mount Apollo middleware to Express
    app.use('/graphql', (0, express4_1.expressMiddleware)(apolloServer));
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', environment: NODE_ENV });
    });
    // Start HTTP server
    await new Promise((resolve) => {
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
//# sourceMappingURL=server.js.map