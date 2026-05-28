import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthToken } from '../types/booking';

export class ApiClient {
  private request: APIRequestContext;
  private baseUrl: string;
  private token: string | null = null;

  constructor(request: APIRequestContext, baseUrl: string = 'https://restful-booker.herokuapp.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async authenticate(username: string = 'admin', password: string = 'password123'): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
      data: { username, password },
    });
    const body: AuthToken = await response.json();
    this.token = body.token;
    return this.token;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Cookie'] = `token=${this.token}`;
    }
    return headers;
  }

  async get(path: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}${path}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async post(path: string, data?: unknown): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}${path}`, {
      headers: this.getAuthHeaders(),
      data: data as any,
    });
  }

  async put(path: string, data?: unknown): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}${path}`, {
      headers: this.getAuthHeaders(),
      data: data as any,
    });
  }

  async patch(path: string, data?: unknown): Promise<APIResponse> {
    return await this.request.patch(`${this.baseUrl}${path}`, {
      headers: this.getAuthHeaders(),
      data: data as any,
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}${path}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
