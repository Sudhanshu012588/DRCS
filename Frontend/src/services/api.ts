export interface BasePlanPayload {
  userId: string;
  Outer_Coodinates: number[][];
  BHK: number;
}

export const sendOuterCoordinates = async (payload: BasePlanPayload) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/outer_coordinates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Extract FastAPI detail string or fallback
      const errorMessage = typeof data.detail === 'string' 
        ? data.detail 
        : `Request failed with status code ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to backend server at http://127.0.0.1:8000');
    }
    throw error;
  }
};