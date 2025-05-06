/**
 * Represents a single search result from a knowledge source
 */
export interface SearchResult {
  /**
   * The actual content/text snippet from the knowledge source
   */
  content: string;
  
  /**
   * Metadata about the search result
   */
  metadata: {
    /**
     * Reference to the original content (e.g., filename, document ID, URL)
     */
    reference: string;
    
    /**
     * The source that provided this result (e.g., "docs", "jira")
     * Note: Plugin authors should leave this field undefined.
     * It will be automatically set by the core service based on the plugin's ID.
     */
    source?: string;
    
    /**
     * ISO date string of last modification
     */
    lastModified: string;
    
    /**
     * Relevance score between 0-1
     */
    score: number;
  }
}
