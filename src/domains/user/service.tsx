import { UserRepository } from "./repository";

export function userService(userRepository: UserRepository) {
  return {
    fetchUserInfo: userRepository.fetchUserInfo,
    updateClassCode: userRepository.updateClassCode,
  };
}
