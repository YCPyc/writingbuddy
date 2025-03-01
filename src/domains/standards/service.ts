import { StandardOption, StandardSet } from "./model";
import { StandardsRepository } from "./repository";

export function standardsService(standardsRepository: StandardsRepository) {
  return {
    fetchStandardSets: async (ids: string[]): Promise<StandardOption[]> => {
      const standardSets = await Promise.all(
        ids.map((id) => standardsRepository.fetchStandardSet(id))
      );
      console.log("standardSets", standardSets);

      return standardSets
        .filter((result): result is { data: StandardSet; error: null } => {
          if (result.error) {
            console.error("Error fetching standard set:", result.error);
            return false;
          }
          return result.data !== null;
        })
        .map((result) => ({
          label: result.data.document.title,
          value: JSON.stringify(result.data.standards),
          standards: result.data.standards,
        }));
    },
  };
} 