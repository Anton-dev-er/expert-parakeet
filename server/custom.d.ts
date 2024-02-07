// Role should hardcoded here

declare namespace Express {
  interface Request {
    user?: {
      role: "Admin" | "User"
      email: string,
      id: number
    }
  }
}