import axios from 'axios';

let cachedToken: string | undefined = undefined;
let expiresAt: number = 0;

/**
 * Returns a valid SFCC access token. Caches token until it expires.
 */
export async function getSFCCAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < expiresAt) {
    console.log("SFCC access token exists. Keep using");
    return cachedToken;
  }

  const clientId = process.env.SFCC_CLIENT_ID || '';
  const clientSecret = process.env.SFCC_CLIENT_SECRET || '';

  try {
    const credentials = `${clientId}:${clientSecret}`;
    const encodedToken = Buffer.from(credentials).toString('base64');

    const headers = {
      Authorization: `Basic ${encodedToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const response = await axios.post(
      'https://account.demandware.com/dw/oauth2/access_token?grant_type=client_credentials',
      null,
      { headers }
    );

    const { access_token, expires_in } = response.data;
    cachedToken = access_token;
    expiresAt = now + (expires_in - 60) * 1000; // refresh 1 min early

    console.log("SFCC access token fetched and cached");
    return cachedToken!;
  } catch (error: any) {
    console.error('Failed to authenticate with SFCC:', error.response?.data || error.message);
    throw new Error('SFCC authentication failed');
  }
}
