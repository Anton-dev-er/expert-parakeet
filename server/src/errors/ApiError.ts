class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super();
    this.status = status
    this.message = message
  }

  static badRequest(message = "Bad request") {
    return new ApiError(404, message)
  }

  static notAuthorized(message = "Not Authorized") {
    return new ApiError(401, message)
  }

  static internal(message = "Internal error") {
    return new ApiError(500, message)
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message)
  }
}

export default ApiError