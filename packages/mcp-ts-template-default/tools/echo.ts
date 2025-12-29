import { z } from "zod";

export const name = "file_echo";
export const description = "Send a message to the server and receive the message back (file-based tool)";
export const parameters = {
  message: z.string().describe("The message to echo back")
};
export const handler = async (params: { message: string }) => {
  return {
    content: [{ type: "text", text: params.message }]
  };
};