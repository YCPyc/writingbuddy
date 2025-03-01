import { ClassRepository, classRepository } from "./repository";

export function classService(classRepository: ClassRepository) {
  return {
    createClass: classRepository.createClass,
    joinClass: classRepository.joinClass,
    getClass: classRepository.getClass,
  };
}
