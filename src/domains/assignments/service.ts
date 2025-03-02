import { Assignment, AssignmentInsert, AssignmentRepository } from "./model";

export function assignmentService(assignmentRepository: AssignmentRepository) {
  return {
    createAssignment: async (assignment: AssignmentInsert): Promise<string | null> => {
      return await assignmentRepository.insertAssignment(assignment);
    },
    getAssignments: async (classCode: string): Promise<Assignment[]> => {
      return await assignmentRepository.getClassAssignments(classCode);
    },
    deleteAssignment: async (assignmentCode: string): Promise<boolean> => {
      return await assignmentRepository.deleteAssignment(assignmentCode);
    },
    async getAssignmentChatHistory(assignmentCode: string) {
      try {
        return await assignmentRepository.getAssignmentChatHistory(assignmentCode);
      } catch (error) {
        console.error("Error in getAssignmentChatHistory service:", error);
        return [];
      }
    }
  };
} 