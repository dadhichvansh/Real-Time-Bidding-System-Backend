export class ApiResponse<T> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data?: T | null;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data ?? null;
  }
}
