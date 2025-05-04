import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { KnowledgeService } from './services/index.js';

// Knowledge service will be provided during initialization
let knowledgeService: KnowledgeService;

// Create MCP server
export const server = new McpServer({
  name: 'KnowFlow',
  version: '0.1.0',
});


/**
 * Initialize the server with the knowledge service and available sources
 * @param service The knowledge service to use for searches
 * @param sources Formatted string of available knowledge sources
 */
export function initializeServer(service: KnowledgeService, sources: string): void {
  // Store the knowledge service for later use
  knowledgeService = service;
  
  // Register the search tool with the provided sources
  server.tool(
    'search_knowledge',
    `Searches for information in the knowledge base. Use this tool when you need to retrieve specific information or context.
    
    Available knowledge sources:
    ${sources}

    IMPORTANT USAGE INSTRUCTIONS:
      1. This tool returns content snippets directly from the knowledge base
      2. DO NOT attempt to access or load the source files mentioned in metadata
      3. Use ONLY the content field from each result to answer queries
      4. ALWAYS cite the EXACT source filenames (including .md extension) when presenting information to users (e.g., 'According to architecture-notes.md...')
      5. Source filenames help users understand where information comes from and allow them to verify it if needed
      6. The lastModified field indicates when the information was updated - newer information may be more relevant
      7. The score field (0-1) indicates how relevant the result is to the query - higher values are more relevant
      8. All necessary information is contained in the content snippets

    Response format:
    {
      instructions: "How to use these results",
      results: [
        {
          content: "The actual text snippet to use (FOCUS ON THIS)",
          metadata: {
            reference: "Filename for reference only - DO NOT ATTEMPT TO LOAD",
            source: "docs",
            lastModified: "Date of last modification",
            score: "Relevance score between 0-1"
          }
        }
      ]
    }
    `,
    {
      query: z.string().describe('The search query to find relevant information'),
      source: z.string().optional().describe('The preferred knowledge source to search (e.g., jira, confluence, docs, slack). If specified, results from this source will be prioritized.'),
      limit: z.number().optional().default(3).describe('Maximum number of results to return')
    },
    async ({ query, source, limit }: { query: string; source?: string; limit: number }) => {
      console.error(`Received search request: query="${query}", source=${source || 'not specified'}, limit=${limit}`);
      
      try {
        // Use the knowledge service to search across plugins
        const response = await knowledgeService.search(query, source, limit);
        
        return {
          content: [
            { 
              type: 'text', 
              text: JSON.stringify(response, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error('Error performing search:', error);
        
        // Return an error response
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'An error occurred while searching the knowledge base.',
                message: error instanceof Error ? error.message : 'Unknown error'
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}
