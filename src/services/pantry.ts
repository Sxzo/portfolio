const PANTRY_ID = "6658418c-dc70-4ca0-a9d2-0cb94b44502c"; // You'll need to create this at getpantry.cloud
const BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}`;

interface Record {
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

interface Records {
  [passageId: string]: Record;
}

interface LeaderboardEntry {
  name: string;
  wpm: number;
  accuracy: number;
  timestamp: number;
}

interface PassageLeaderboard {
  [passageId: string]: LeaderboardEntry[];
}

// Utility to fetch all scores for a passage
async function getAllScores(passageId: string): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`${BASE_URL}/basket/typeracer-leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch scores');
    }
    const data: PassageLeaderboard = await response.json();
    return data[passageId] || [];
  } catch (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
}

export const pantryService = {
  // Simple submission lock to prevent multiple rapid submissions
  isSubmitting: false,

  /**
   * Get top 3 leaderboard entries for a passage
   */
  async getLeaderboard(passageId: string): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${BASE_URL}/basket/typeracer-leaderboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch leaderboard');
      }

      const data: PassageLeaderboard = await response.json();
      const scores = data[passageId] || [];
      // Return only the top 3 for display
      return scores.sort((a, b) => b.wpm - a.wpm).slice(0, 3);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  /**
   * Checks if a name is available (not currently used in the top 10 list).
   * You can keep or remove this based on your app's needs.
   */
  async checkNameAvailability(passageId: string, name: string): Promise<boolean> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return false;
    }
    
    const allScores = await getAllScores(passageId);
    return !allScores.some(
      entry => entry.name.toLowerCase() === trimmedName.toLowerCase()
    );
  },

  async getRecord(passageId: string): Promise<Record | null> {
    try {
      const response = await fetch(`${BASE_URL}/basket/records`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Create the basket if it doesn't exist
          await fetch(`${BASE_URL}/basket/records`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({}),
          });
          return null;
        }
        throw new Error('Failed to fetch record');
      }

      const data: Records = await response.json();
      return data[passageId] || null;
    } catch (error) {
      console.error('Error fetching record:', error);
      return null;
    }
  },

  /**
   * Submit a new score, overwriting the old score if the name already exists.
   * Stores up to top 10 in the backend. (Adjust as desired.)
   */
  async submitScore(
    passageId: string,
    entry: Omit<Record, 'timestamp'>
  ): Promise<boolean> {
    if (this.isSubmitting) return false;

    try {
      this.isSubmitting = true;
      const trimmedName = entry.name.trim();
      if (!trimmedName) return false;

      // Get current record
      const currentRecord = await this.getRecord(passageId);
      
      // Only save if it's a new record
      if (currentRecord && entry.wpm <= currentRecord.wpm) {
        return false;
      }

      // Get existing records
      const response = await fetch(`${BASE_URL}/basket/records`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      const data: Records = response.ok ? await response.json() : {};

      // Update with new record
      const newData = {
        ...data,
        [passageId]: {
          name: trimmedName,
          wpm: entry.wpm,
          accuracy: entry.accuracy,
          timestamp: Date.now()
        }
      };

      // Save the new record
      const saveResponse = await fetch(`${BASE_URL}/basket/records`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(newData)
      });

      return saveResponse.ok;
    } catch (error) {
      console.error('Error submitting score:', error);
      return false;
    } finally {
      this.isSubmitting = false;
    }
  },

  async getAllRecords(): Promise<Record[]> {
    try {
      const response = await fetch(`${BASE_URL}/basket/records`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Failed to fetch records');
      }

      const data: Records = await response.json();
      return Object.values(data);
    } catch (error) {
      console.error('Error fetching all records:', error);
      return [];
    }
  },
};
