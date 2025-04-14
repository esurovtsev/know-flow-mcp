import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Create MCP server
export const server = new McpServer({
  name: 'KnowFlow',
  version: '0.1.0',
});

// Register a search tool with clear guidance on how to use the response
server.tool(
  'search_knowledge',
  `Searches for information in the knowledge base. Use this tool when you need to retrieve specific information or context.
  
  Available knowledge systems:
    - jira: For Jira tickets, epics, and project information
    - confluence: For documentation, specifications, and team wikis
    - slack: For team discussions and decisions from chat channels
    - docs: For architecture documents, technical specifications, and notes (default)

  IMPORTANT USAGE INSTRUCTIONS:
    1. This tool returns content snippets directly from the knowledge base
    2. DO NOT attempt to access or load the source files mentioned in metadata
    3. Use ONLY the content field from each result to answer queries
    4. ALWAYS cite the EXACT source filenames (including .md extension) when presenting information to users (e.g., 'According to architecture-notes.md...')
    5. Source filenames help users understand where information comes from and allow them to verify it if needed
    6. The lastModified field indicates when the information was updated - newer information may be more relevant
    7. The confidence field (0-1) indicates how relevant the result is to the query - higher values are more relevant
    8. All necessary information is contained in the content snippets

  Response format:
  {
    instructions: "How to use these results",
    results: [
      {
        content: "The actual text snippet to use (FOCUS ON THIS)",
        metadata: {
          source: "Filename for reference only - DO NOT ATTEMPT TO LOAD",
	  system: "docs",
          lastModified: "Date of last modification",
          confidence: "Relevance score between 0-1"
        }
      }
    ]
  }

  `,
  {
    query: z.string().describe('The search query to find relevant information'),
    system: z.string().optional().describe('The preferred knowledge system or source to search (e.g., jira, confluence, docs, slack). If specified, results from this system will be prioritized.'),
    limit: z.number().optional().default(3).describe('Maximum number of results to return')
  },
  async ({ query, system, limit }: { query: string; system?: string; limit: number }) => {
    console.error(`Received search request: query="${query}", system=${system || 'not specified'}, limit=${limit}`);
    
    // The system parameter is defined in the interface but not used in the current implementation
    
    // Improved response format with stronger guidance for LLM behavior
    const dummyResponse = {
      instructions: "IMPORTANT: The snippets below contain ALL necessary information to answer the query. DO NOT attempt to access or load the source files mentioned in metadata. Use ONLY the content field from each result. ALWAYS cite the EXACT source filenames WITH EXTENSION (e.g., 'According to architecture-notes.md...'). DO NOT paraphrase source names like 'architecture notes' - use the exact filename 'architecture-notes.md'. The lastModified date shows when information was updated (newer may be more relevant). The confidence score (0-1) indicates how relevant each result is to your query.",
      results: [
        {
          content: "We agreed to consolidate all backend modules under a single monorepo using Nx.",
          metadata: {
            source: "architecture-notes.md",
            system: "docs",
            lastModified: "2024-03-14",
            confidence: 0.95
          }
        },
        {
          content: `This is relevant information for your query: "${query}". The team decided to use TypeScript for all new microservices.`,
          metadata: {
            source: "tech-stack-decisions.md",
            system: "docs",
            lastModified: "2024-03-20",
            confidence: 0.87
          }
        }
      ]
    };
    
    return {
      content: [
        { 
          type: 'text', 
          text: JSON.stringify(dummyResponse, null, 2)
        }
      ]
    };
  }
);
