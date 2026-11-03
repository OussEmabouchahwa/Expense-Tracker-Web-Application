import * as userRepo from "./users.repository.js";
import { AppError } from "../../lib/app-error.js";
import { UpdateUserInput } from "@masrouf/contracts";

export async function getProfile(userId: string) {
  const user = await userRepo.findUserById(userId);
  if (!user) {
    throw AppError.notFound("User not found");
  }
  return user;
}

export async function updateProfile(userId: string, input: UpdateUserInput) {
  return userRepo.updateUser(userId, input);
}

export async function exportUserData(userId: string) {
  return userRepo.exportAllUserData(userId);
}

export async function deleteAccount(userId: string) {
  await userRepo.deleteUserAndAllData(userId);
}
