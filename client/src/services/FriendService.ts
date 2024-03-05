import { BASE_URL } from '@/src/utils';
import AuthService from '@/src/services/AuthService';
import { User } from '@/src/types';
import { FriendResponse } from '@/src/types/response/FriendResponse';

class HttpService {
  private readonly baseUrl: string;
  private readonly useAccessToken: boolean;

  constructor(baseUrl: string, useAccessToken = false) {
    this.baseUrl = `${BASE_URL}${baseUrl}`;
    this.useAccessToken = useAccessToken;
  }

  private async fetch(
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ): Promise<Response> {
    // todo refactor
    if (!init) {
      init = {};
    }

    if (!init.headers) {
      init.headers = {
        'Content-Type': 'application/json',
      };
    }

    if (this.useAccessToken) {
      const accessToken = localStorage.getItem('token');
      init.headers = {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      init.credentials = 'include';
    }

    const response = await fetch(input, init);

    if (response.status === 401) {
      const tokens = await AuthService.refresh();
      localStorage.setItem('token', tokens.accessToken);
      return await this.fetch(input, init);
    }

    return response;
  }

  async get(url: string, params?: any, headers?: any) {
    const response = await this.fetch(`${this.baseUrl}${url}?` + new URLSearchParams(params), {
      method: 'GET',
      headers,
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error((await response.json()).message);
  }

  async post(url: string, data?: any, headers?: any) {
    const response = await this.fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error((await response.json()).message);
  }
}

export default class FriendService {
  static api = new HttpService('/api/friends', true);

  static async createInvite(userId: string, friendId: string): Promise<FriendResponse> {
    return this.api.post(`/${userId}`, { friendId });
  }

  static async getFriends(userId: string): Promise<FriendResponse[]> {
    return this.api.get(`/${userId}`);
  }

  static async getAvailableUsers(userId: string): Promise<User[]> {
    return this.api.get(`/${userId}/users`);
  }

  static async getInvites(userId: string): Promise<FriendResponse[]> {
    return this.api.get(`/${userId}/invites`);
  }

  static async acceptInvite(friendId: string): Promise<void> {
    return this.api.get(`/${friendId}/accept`);
  }

  static async declineInvite(friendId: string): Promise<void> {
    return this.api.get(`/${friendId}/decline`);
  }
}
