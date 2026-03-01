#!/usr/bin/env node

/**
 * TASKEY GRAPHQL API TEST SUITE
 *
 * This file demonstrates how to test the GraphQL API
 * Run from directory: npm run dev (in another terminal)
 * Then run: node test-api.js
 */

const http = require('http');

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

// Helper function to make GraphQL requests
async function graphqlRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query, variables });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Test queries
const tests = [
  {
    name: 'Get all projects',
    query: `
      query {
        projects {
          id
          title
          description
          tasks {
            id
            title
          }
        }
      }
    `,
  },
  {
    name: 'Get all tags',
    query: `
      query {
        tags {
          id
          title
        }
      }
    `,
  },
  {
    name: 'Get all tasks',
    query: `
      query {
        tasks {
          id
          title
          priority
          status
          progress
          project {
            id
            title
          }
          tags {
            id
            title
          }
        }
      }
    `,
  },
  {
    name: 'Get single task',
    query: `
      query {
        task(id: 1) {
          id
          title
          priority
          status
          progress
          createdAt
          project {
            id
            title
          }
          tags {
            id
            title
          }
        }
      }
    `,
  },
  {
    name: 'Create a new project',
    query: `
      mutation {
        createProject(input: {
          title: "Test Project"
          description: "A project created by automation"
        }) {
          id
          title
          description
        }
      }
    `,
  },
];

// Run tests
async function runTests() {
  console.log('\n🧪 TASKEY GRAPHQL API TEST SUITE\n');
  console.log('Make sure the server is running: npm run dev\n');

  for (const test of tests) {
    try {
      console.log(`📝 Testing: ${test.name}`);
      const result = await graphqlRequest(test.query);

      if (result.data.errors) {
        console.log(`   ❌ Error: ${result.data.errors[0].message}\n`);
      } else {
        console.log(`   ✅ Success\n`);
      }
    } catch (error) {
      console.log(`   ❌ Connection Error: ${error.message}`);
      console.log(`   Make sure the server is running on port 4000\n`);
      break;
    }
  }

  console.log('✨ Tests completed!\n');
  console.log('GraphQL Playground available at: http://localhost:4000/graphql\n');
}

runTests();
