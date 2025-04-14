#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './server.js';

async function main() {
  try {
    // Initialize server transport
    const transport = new StdioServerTransport();
    
    // Connect the server to the transport
    await server.connect(transport);
    
    console.error('KnowFlow MCP Server running on stdio');
  } catch (error) {
    console.error('Error starting KnowFlow MCP Server:', error);
    process.exit(1);
  }
}

main();
