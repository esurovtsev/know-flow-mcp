import { PluginRegistry, SearchResult, SearchResponse } from '../core/index.js';

/**
 * Service that coordinates searches across multiple knowledge source plugins
 */
export class KnowledgeService {
  private registry: PluginRegistry;
  
  /**
   * Create a new KnowledgeService
   * @param registry The plugin registry to use
   */
  constructor(registry: PluginRegistry) {
    this.registry = registry;
  }
  
  /**
   * Search for information across available knowledge sources
   * @param query The search query
   * @param source Optional source to prioritize (e.g., "docs", "jira")
   * @param limit Maximum number of results to return
   * @returns Promise resolving to formatted response
   */
  async search(query: string, source?: string, limit: number = 3): Promise<SearchResponse> {
    console.error(`KnowledgeService searching for: "${query}", source=${source || 'not specified'}, limit=${limit}`);
    
    // Get all available plugins
    const availablePlugins = await this.registry.getAvailablePlugins();
    
    // Log which plugins we're searching
    console.error(`Searching across ${availablePlugins.length} available plugins`);
    
    // Search all plugins in parallel
    const searchPromises = availablePlugins.map(async plugin => {
      try {
        // Only search if plugin is available
        if (await plugin.isAvailable()) {
          console.error(`Searching plugin: ${plugin.id}`);
          // Search each plugin with the full limit to get all potential matches
          const results = await plugin.search(query, limit);
          console.error(`Plugin ${plugin.id} returned ${results.length} results`);
          
          // Tag each result with the source plugin ID and apply score boost if needed
          return results.map(result => {
            // Calculate score - boost it if this plugin matches the requested source
            let score = result.metadata.score;
            if (source && plugin.id === source) {
              score = Math.min(1, score + 0.2);
              console.error(`Boosting result from ${plugin.id}: ${result.metadata.score} -> ${score}`);
            }
            
            return {
              ...result,
              metadata: {
                ...result.metadata,
                source: plugin.id,
                score: score
              }
            };
          });
        }
      } catch (error) {
        console.error(`Error searching with plugin ${plugin.id}:`, error);
      }
      return [];
    });
    
    // Wait for all searches to complete
    const allResultsArrays = await Promise.all(searchPromises);
    
    // Flatten the array of arrays into a single array
    const allResults = allResultsArrays.flat();
    console.error(`Total results from all plugins: ${allResults.length}`);
    
    // Sort all results by score
    const sortedResults = allResults.sort((a, b) => {
      return b.metadata.score - a.metadata.score;
    });
    
    // Apply the limit after sorting
    const limitedResults = sortedResults.slice(0, limit);
    console.error(`Returning ${limitedResults.length} results after applying limit`);
    
    // Format the response according to our defined structure
    return {
      instructions: "IMPORTANT: The snippets below contain ALL necessary information to answer the query. DO NOT attempt to access or load the source files mentioned in metadata. Use ONLY the content field from each result. ALWAYS cite the EXACT source filenames WITH EXTENSION (e.g., 'According to architecture-notes.md...'). DO NOT paraphrase source names like 'architecture notes' - use the exact filename 'architecture-notes.md'. The lastModified date shows when information was updated (newer may be more relevant). The score (0-1) indicates how relevant each result is to your query.",
      results: limitedResults
    };
  }
  
  /**
   * Get information about all available knowledge sources
   * @returns Promise resolving to array of available sources
   */
  async getAvailableSources(): Promise<Array<{ id: string; name: string; description: string }>> {
    const availablePlugins = await this.registry.getAvailablePlugins();
    
    return availablePlugins.map(plugin => ({
      id: plugin.id,
      name: plugin.name,
      description: plugin.description
    }));
  }
}
