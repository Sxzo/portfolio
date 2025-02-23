const PANTRY_ID = "6658418c-dc70-4ca0-a9d2-0cb94b44502c"; // You'll need to create this at getpantry.cloud
const BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}`;

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

  /**
   * Submit a new score, overwriting the old score if the name already exists.
   * Stores up to top 10 in the backend. (Adjust as desired.)
   */
  async submitScore(
    passageId: string,
    entry: Omit<LeaderboardEntry, 'timestamp'>
  ): Promise<boolean> {
    if (this.isSubmitting) {
      return false;
    }

    try {
      this.isSubmitting = true;
      const trimmedName = entry.name.trim();
      
      if (!trimmedName) {
        return false;
      }

      // Get current leaderboard data
      const response = await fetch(`${BASE_URL}/basket/typeracer-leaderboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      // Get existing data or start with empty object
      const data: PassageLeaderboard = response.ok ? await response.json() : {};
      
      // Get existing scores for this passage
      const existingScores = data[passageId] || [];

      // Create the new score
      const newScore: LeaderboardEntry = {
        name: trimmedName,
        wpm: entry.wpm,
        accuracy: entry.accuracy,
        timestamp: Date.now()
      };

      // Combine existing scores with new score, remove duplicates by name,
      // sort by WPM, and take top 3
      const updatedScores = [...existingScores, newScore]
        // Remove duplicates (keep the latest score for each name)
        .reduce((acc, current) => {
          const x = acc.find(item => item.name.toLowerCase() === current.name.toLowerCase());
          if (!x) {
            return acc.concat([current]);
          } else {
            // If duplicate found, keep the one with higher WPM
            return acc.map(item => 
              item.name.toLowerCase() === current.name.toLowerCase()
                ? (item.wpm > current.wpm ? item : current)
                : item
            );
          }
        }, [] as LeaderboardEntry[])
        // Sort by WPM and keep top 3
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 3);

      // Update data with new scores
      const newData = {
        ...data,
        [passageId]: updatedScores
      };

      // Save the updated leaderboard
      const saveResponse = await fetch(`${BASE_URL}/basket/typeracer-leaderboard`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
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
};
