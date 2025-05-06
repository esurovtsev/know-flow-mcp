import { PluginRegistry } from '../core/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Discovers and loads all plugins in the plugins directory
 * @param registry The plugin registry to register discovered plugins with
 */
export async function discoverPlugins(registry: PluginRegistry): Promise<void> {
  try {
    // Import the test-docs plugin directly for now
    // In the future, we'll dynamically discover plugins
    const testDocsPlugin = await import('./test-docs/index.js');
    
    if (testDocsPlugin.default) {
      registry.registerPlugin(testDocsPlugin.default);
    }
    
    console.error('Plugin discovery completed');
  } catch (error) {
    console.error('Error discovering plugins:', error);
  }
}
