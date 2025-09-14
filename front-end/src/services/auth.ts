import api from './api'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'agent' | 'client'
  fullName: string
  isActive: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
  role?: 'admin' | 'agent' | 'client'
}

export interface AuthResponse {
  user: User
  token: {
    value: string
    type: string
    expiresAt: string
  }
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    const { user, token } = response.data

    localStorage.setItem('auth_token', token.value)
    localStorage.setItem('user', JSON.stringify(user))

    return response.data
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    const { user, token } = response.data

    
    localStorage.setItem('auth_token', token.value)
    localStorage.setItem('user', JSON.stringify(user))

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me')
      const user = response.data.user

      localStorage.setItem('user', JSON.stringify(user))

      return user
    } catch (error) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    }
  }

  getStoredUser(): User | null {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}

export const authService = new AuthService()
