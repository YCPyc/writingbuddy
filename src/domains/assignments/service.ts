import { Assignment, AssignmentInsert, AssignmentRepository, StudentAssignment } from "./model";

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
    },
    async getAssignmentDetails(assignmentCode: string) {
      try {
        return await assignmentRepository.getAssignmentDetails(assignmentCode);
      } catch (error) {
        console.error("Error in getAssignmentDetails service:", error);
        return null;
      }
    },
    async getStudentAssignments(studentId: string): Promise<StudentAssignment[] | null> {
      try {
        return await assignmentRepository.getStudentAssignments(studentId);
      } catch (error) {
        console.error("Error in getStudentAssignments service:", error);
        return null;
      }
    }
  };
} 