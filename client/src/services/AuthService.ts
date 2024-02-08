import Http from '../http/index'
import { AuthResponse } from '@/src/types/response/AuthResponse'

export default class AuthService {
  static api = new Http('http://localhost:5000/api/auth', true)

  static async login(email: string, password: string): Promise<AuthResponse> {
    return this.api.post("/login", {email, password})
  }

  static async registration(email: string, password: string): Promise<AuthResponse> {
    return this.api.post("/registration", {email, password})
  }

  static async logout(): Promise<AuthResponse> {
    return this.api.post("/logout")
  }

  static async refresh() {
    return this.api.get("/refresh")
  }
}
