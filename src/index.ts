#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server, initializeServer } from './server.js';
import { PluginRegistry } from './core/index.js';
import { KnowledgeService } from './services/index.js';
import { discoverPlugins } from './plugins/index.js';

// Initialize plugin registry and knowledge service
const pluginRegistry = new PluginRegistry();
const knowledgeService = new KnowledgeService(pluginRegistry);

async function main() {

  // Discover plugins as a normal blocking call
  console.error('Discovering plugins...');
  try {
    // Using top-level await which is supported in ES modules
    await discoverPlugins(pluginRegistry);
    console.error('Plugins loaded successfully');
  } catch (error) {
    console.error('Error during plugin discovery:', error);
  }

  // Get available sources from the registry
  const plugins = pluginRegistry.getAllPlugins();
  const availableSources = plugins.map(plugin => {
    return `    - ${plugin.id}: ${plugin.description}`;
  }).join('\n');
  
  // Format sources string, clearly indicating if no plugins are found
  const sourcesList = availableSources.length > 0
    ? availableSources
    : '    - No knowledge sources currently available';
  
  // Initialize the server with the knowledge service and sources
  initializeServer(knowledgeService, sourcesList);

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
