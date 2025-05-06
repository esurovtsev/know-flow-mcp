import { KnowledgeSourcePlugin } from '../interfaces/KnowledgeSourcePlugin.js';

/**
 * Registry that manages all available knowledge source plugins
 */
export class PluginRegistry {
  private plugins: Map<string, KnowledgeSourcePlugin> = new Map();
  
  /**
   * Register a plugin with the registry
   * @param plugin The plugin to register
   * @throws Error if a plugin with the same ID is already registered
   */
  registerPlugin(plugin: KnowledgeSourcePlugin): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with ID "${plugin.id}" is already registered`);
    }
    
    this.plugins.set(plugin.id, plugin);
    console.error(`Registered plugin: ${plugin.name} (${plugin.id})`);
  }
  
  /**
   * Get a plugin by its ID
   * @param id The plugin ID
   * @returns The plugin or undefined if not found
   */
  getPlugin(id: string): KnowledgeSourcePlugin | undefined {
    return this.plugins.get(id);
  }
  
  /**
   * Get a plugin by its source identifier
   * @param source The source identifier (e.g., "docs", "jira")
   * @returns The plugin or undefined if not found
   */
  getPluginBySource(source: string): KnowledgeSourcePlugin | undefined {
    // Since we're using the plugin's ID as the source identifier,
    // this is just an alias for getPlugin
    return this.getPlugin(source);
  }
  
  /**
   * Get all registered plugins
   * @returns Array of all registered plugins
   */
  getAllPlugins(): KnowledgeSourcePlugin[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * Get only plugins that are available for use
   * @returns Promise resolving to array of available plugins
   */
  async getAvailablePlugins(): Promise<KnowledgeSourcePlugin[]> {
    const availablePlugins: KnowledgeSourcePlugin[] = [];
    
    for (const plugin of this.plugins.values()) {
      try {
        if (await plugin.isAvailable()) {
          availablePlugins.push(plugin);
        }
      } catch (error) {
        console.error(`Error checking availability of plugin ${plugin.id}:`, error);
      }
    }
    
    return availablePlugins;
  }
}
