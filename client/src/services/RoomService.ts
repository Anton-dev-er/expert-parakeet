import { RoomResponse } from '@/src/types/response/RoomResponse';
import { BASE_URL } from '@/src/utils';
import AuthService from '@/src/services/AuthService';
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
export default class RoomService {
  static api = new HttpService('/api/rooms', true);

  static async getUserRooms(userId: string): Promise<RoomResponse[]> {
    return this.api.get(`/${userId}`);
  }

  static async createRoom(
    userId: string,
    roomName: string,
    roomRoute: string,
    isPrivate: boolean,
    isOwner: boolean
  ): Promise<RoomResponse> {
    return this.api.post(`/${userId}`, { roomName, roomRoute, isPrivate, isOwner });
  }
}
