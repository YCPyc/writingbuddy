import { ClassRepository, classRepository } from "./repository";

export function classService(classRepository: ClassRepository) {
  return {
    createClass: classRepository.createClass,
    joinAssignment: classRepository.joinAssignment,
    getClass: classRepository.getClass,
  };
}
