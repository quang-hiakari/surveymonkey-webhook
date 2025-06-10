import axios from 'axios';

/**
 * Authenticates with Salesforce Commerce Cloud using client ID and secret.
 *
 * @param clientId - SFCC client ID
 * @param clientSecret - SFCC client secret
 * @returns access_token string
 */
export async function authenticateToSFCC(clientId: string, clientSecret: string): Promise<string> {
  try {
    const credentials = `${clientId}:${clientSecret}`;
    const encodedToken = Buffer.from(credentials).toString('base64');

    const headers = {
      'Authorization': `Basic ${encodedToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const response = await axios.post(
      'https://account.demandware.com/dw/oauth2/access_token?grant_type=client_credentials',
      null,
      { headers }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('Failed to authenticate with SFCC:', error.response?.data || error.message);
    throw new Error('SFCC authentication failed');
  }
}
