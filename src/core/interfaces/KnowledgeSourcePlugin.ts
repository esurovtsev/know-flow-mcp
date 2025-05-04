import { SearchResult } from './SearchResult.js';

/**
 * Interface that all knowledge source plugins must implement
 */
export interface KnowledgeSourcePlugin {
  /**
   * Unique identifier for this plugin
   */
  id: string;
  
  /**
   * Human-readable name of the plugin
   */
  name: string;
  
  /**
   * Description of what knowledge source this plugin provides
   * This should be comprehensive enough for LLMs to understand when to select this source
   * Example: "For Jira tickets, epics, and project information" or "For architecture documents, technical specifications, and notes"
   */
  description: string;
  

  /**
   * Check if this plugin is available and configured correctly
   * @returns Promise resolving to true if plugin is ready to use
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Search for information matching the query
   * @param query The search query string
   * @param limit Maximum number of results to return
   * @returns Promise resolving to an array of search results
   */
  search(query: string, limit: number): Promise<SearchResult[]>;
}
