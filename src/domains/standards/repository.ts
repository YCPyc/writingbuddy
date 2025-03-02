import { Errorable } from "../utils/errorable";
import { StandardSet } from "./model";

export interface StandardsRepository {
  fetchStandardSet(id: string): Promise<Errorable<StandardSet>>;
}

export const standardsRepository = (): StandardsRepository => {
  return {
    fetchStandardSet: async (id: string) => {
      try {
        const response = await fetch(
          `https://commonstandardsproject.com/api/v1/standard_sets/${id}`,
          {
            method: 'GET',
            headers: {
              "Api-Key": import.meta.env.WXT_COMMON_STANDARD_API_KEY,
              "Accept": "application/json",
            },
            mode: 'cors',
            credentials: 'omit'
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch standards");
        }

        const { data } = await response.json();
        console.log("data", data);
        return { data, error: null };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { data: null, error: errorMessage };
      }
    },
  };
};