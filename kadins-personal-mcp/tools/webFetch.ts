import { z } from "zod";

export const name = "web_fetch";
export const description = "Fetch content from a specified URL";
export const parameters = {
  url: z.string().describe("The URL to fetch content from"),
  max_content_size: z.number().describe("Maximum content size to fetch in KB").optional().default(500)
};
export const handler = async (params: { url: string; max_content_size: number }) => {
  try {
    const { default: fetch } = await import("node-fetch");
    
    // Fetch the content from the URL
    const response = await fetch(params.url);
    
    if (!response.ok) {
      return {
        content: [{ type: "text", text: `Error: Failed to fetch URL. Status: ${response.status} ${response.statusText}` }]
      };
    }
    
    // Check content length header if available
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const sizeInKB = parseInt(contentLength) / 1024;
      if (sizeInKB > params.max_content_size) {
        return {
          content: [{ type: "text", text: `Error: Content is too large to fetch (${sizeInKB.toFixed(2)}KB). Maximum allowed size is ${params.max_content_size}KB.` }]
        };
      }
    }
    
    const content = await response.text();
    
    // Limit content size
    const maxSize = params.max_content_size * 1024; // Convert to bytes
    let limitedContent = content;
    if (content.length > maxSize) {
      limitedContent = content.substring(0, maxSize) + '\n\n... (content truncated)';
    }
    
    return {
      content: [{ type: "text", text: `Content from ${params.url}:\n\n${limitedContent}` }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error fetching URL: ${(error as Error).message}` }]
    };
  }
};