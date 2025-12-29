import { z } from "zod";

export const name = "calculator";
export const description = "Perform basic mathematical calculations";
export const parameters = {
  operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The mathematical operation to perform"),
  a: z.number().describe("The first operand"),
  b: z.number().describe("The second operand")
};
export const handler = async (params: { operation: string; a: number; b: number }) => {
  let result: number;
  
  switch (params.operation) {
    case "add":
      result = params.a + params.b;
      break;
    case "subtract":
      result = params.a - params.b;
      break;
    case "multiply":
      result = params.a * params.b;
      break;
    case "divide":
      if (params.b === 0) {
        return {
          content: [{ type: "text", text: "Error: Division by zero is not allowed" }]
        };
      }
      result = params.a / params.b;
      break;
    default:
      return {
        content: [{ type: "text", text: `Error: Unknown operation ${params.operation}` }]
      };
  }
  
  return {
    content: [{ type: "text", text: `Result: ${params.a} ${params.operation} ${params.b} = ${result}` }]
  };
};