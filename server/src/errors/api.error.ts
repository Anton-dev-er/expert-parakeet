class ApiError extends Error {
  type: 'ApiError'
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError(message = "Not Authorized") {
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