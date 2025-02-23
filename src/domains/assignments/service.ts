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
  };
} 