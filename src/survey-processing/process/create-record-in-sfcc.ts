import axios from 'axios';

const SFCC_BASE_URL = process.env.SFCC_OCAPI_BASE_URL; // e.g. https://your-instance.demandware.net/s/-/dw/data/v24_5/custom_objects/QuestionaireAnswered

/**
 * Creates a custom object only if it does not already exist.
 * @param key The custom object key (e.g., orderNumber)
 * @param data The custom object data (custom attributes)
 * @returns response data or existing object info
 */
export const createCustomObjectIfNotExists = async (accessToken: string, key: string, data: Record<string, any>) => {
  const url = `${SFCC_BASE_URL}/${key}`;

  try {
    // Check if object exists
    await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // If found (status 200), object exists
    return {
      created: false,
      message: `Custom object with key "${key}" already exists.`
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Not found — proceed to create
      try {
        const response = await axios.put(url, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        return {
          created: true,
          message: 'Custom object created successfully.',
          data: response.data
        };
      } catch (createError: any) {
        console.error('Error creating custom object:', createError?.response?.data || createError.message);
        throw new Error('Failed to create custom object.');
      }
    } else {
      // Other errors
      console.error('Error checking custom object:', error?.response?.data || error.message);
      throw new Error('Failed to check custom object existence.');
    }
  }
};
