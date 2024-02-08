class Http {
  private readonly baseUrl: string
  private readonly useAccessToken: boolean

  constructor(baseUrl: string, useAccessToken = false) {
    this.baseUrl = baseUrl
    this.useAccessToken = useAccessToken
  }

  private async fetch(input: string | URL | globalThis.Request, init?: RequestInit) {
    // todo refactor
    if (!init) {
      init = {}
    }

    if (!init.headers) {
      init.headers = {
        'Content-Type': 'application/json',
      }
    }

    if (this.useAccessToken) {
      const accessToken = localStorage.getItem('token')
      init.headers = {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      }

      init.credentials = 'include'
    }

    return await fetch(input, init)
  }

  async get(url: string, headers?: any) {
    const response = await this.fetch(`${this.baseUrl}${url}`, {
      method: 'GET',
      headers,
    })
    if (response.ok) {
      return response.json()
    }
    throw new Error((await response.json()).message)
  }

  async post(url: string, data?: any, headers?: any) {
    const response = await this.fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return response.json()
    }
    throw new Error((await response.json()).message)
  }
}

export default Http
