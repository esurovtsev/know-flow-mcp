import { KnowledgeSourcePlugin, SearchResult } from '../../core/index.js';

/**
 * A simple test plugin that returns dummy data
 * This is used for testing the plugin architecture
 */
class TestDocsPlugin implements KnowledgeSourcePlugin {
  /**
   * Unique identifier for this plugin
   */
  id = 'docs';

  /**
   * Human-readable name of the plugin
   */
  name = 'Test Documentation';

  /**
   * Description of what knowledge source this plugin provides
   * This should be comprehensive enough for LLMs to understand when to select this source
   */
  description = 'For architecture documents, technical specifications, and notes';

  /**
   * Check if this plugin is available and configured correctly
   * @returns Promise resolving to true if plugin is ready to use
   */
  async isAvailable(): Promise<boolean> {
    // This test plugin is always available
    return true;
  }

  /**
   * Search for information matching the query
   * @param query The search query string
   * @param limit Maximum number of results to return
   * @returns Promise resolving to an array of search results
   */
  async search(query: string, limit: number): Promise<SearchResult[]> {
    console.error(`TestDocsPlugin searching for: "${query}" with limit ${limit}`);
    
    // Return dummy results that include the query in one of the results
    const results: SearchResult[] = [
      {
        content: "We agreed to consolidate all backend modules under a single monorepo using Nx.",
        metadata: {
          reference: "architecture-notes.md",
          lastModified: "2024-03-14",
          score: 0.95
        }
      },
      {
        content: `This is relevant information for your query: "${query}". The team decided to use TypeScript for all new microservices.`,
        metadata: {
          reference: "tech-stack-decisions.md",
          lastModified: "2024-03-20",
          score: 0.87
        }
      }
    ];
    
    // Limit the results if needed
    return results.slice(0, limit);
  }
}

// Export an instance of the plugin as the default export
export default new TestDocsPlugin();
