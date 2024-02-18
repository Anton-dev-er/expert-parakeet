import AuthService from '@/src/services/AuthService';

// todo move to env
const BASE_URL = 'http://localhost:5555';

class Http {
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
      console.log('refresh tokens:', tokens);
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

export { BASE_URL };
export default Http;
