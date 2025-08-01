import { ZodError } from "zod";

export const validateFormData = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse(req.body);
    req.validatedData = parsedData;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // const errorMessages = error.errors.map((issue) => ({
      //   message: `${issue.path.join(".")} is ${issue.message}`,
      // }));
      const errorMessages = (error.issues || error.errors).map((issue) => ({
        message: issue.path?.length
          ? `${issue.path.join(".")} ${issue.message}`
          : issue.message,
      }));
      return res.status(400).json({
        error: "Validation failed",
        details: errorMessages,
      });
    }
    next(error);
  }
};
