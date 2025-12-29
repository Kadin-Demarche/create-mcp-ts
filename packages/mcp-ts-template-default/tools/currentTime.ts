import { z } from "zod";

export const name = "get_current_time";
export const description = "Get the current date and time";
export const parameters = {};
export const handler = async () => {
  const now = new Date();
  return {
    content: [{ type: "text", text: `Current date and time: ${now.toString()}` }]
  };
};