import { SearchResult } from './SearchResult.js';

/**
 * Interface representing the formatted search response
 * This matches the structure expected by the MCP tool
 */
export interface SearchResponse {
  /**
   * Instructions for the LLM on how to use the search results
   */
  instructions: string;
  
  /**
   * Array of search results from knowledge sources
   */
  results: SearchResult[];
}
