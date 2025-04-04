import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export default class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status ?? 500;

    this.logger.error(
      exception?.message || "Unhandled exception",
      exception?.stack || "",
    );

    return response.status(status).json({
      status_code: status,
      status: false,
      message:
        exception?.response?.message ||
        exception.message ||
        "Internal server error"
    });
  }
}