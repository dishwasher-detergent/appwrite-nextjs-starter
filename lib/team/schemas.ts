import {
  TEAM_ABOUT_MAX_LENGTH,
  TEAM_NAME_MAX_LENGTH,
} from "@/constants/team.constants";
import { z } from "zod";

export const addTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(TEAM_NAME_MAX_LENGTH, "Name must be less than 50 characters"),
  about: z
    .string()
    .max(TEAM_ABOUT_MAX_LENGTH, "About must be less than 256 characters"),
});

export type AddTeamFormData = z.infer<typeof addTeamSchema>;

export const editTeamSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(TEAM_NAME_MAX_LENGTH, "Name must be less than 50 characters"),
  about: z
    .string()
    .max(TEAM_ABOUT_MAX_LENGTH, "About must be less than 256 characters"),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type EditTeamFormData = z.infer<typeof editTeamSchema>;

export const deleteTeamSchema = z.object({
  name: z.string().min(1).max(TEAM_NAME_MAX_LENGTH),
});

export type DeleteTeamFormData = z.infer<typeof deleteTeamSchema>;

export const inviteTeamSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type InviteTeamFormData = z.infer<typeof inviteTeamSchema>;

export const leaveTeamSchema = z.object({
  name: z.string().min(1),
});

export type LeaveTeamFormData = z.infer<typeof leaveTeamSchema>;
