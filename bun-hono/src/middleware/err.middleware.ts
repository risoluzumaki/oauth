
import { Context } from "hono";
import ApiError from "../common/api.error";

export const errMiddleware = (err: Error, c: Context) => {
  let statusCode = 500;
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
  }
  return c.json(
    {
      status: "error",
      statusCode: statusCode,
      message: err.message,
    },
    statusCode
  );
};
