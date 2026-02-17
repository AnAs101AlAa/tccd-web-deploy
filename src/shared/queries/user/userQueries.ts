import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi, type UpdateUserProfilePayload, type UpdateStudentProfilePayload } from "./userApi";
import { useUserActions } from "./userHooks";

export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

const userApiInstance = new UserApi();

export const useUpdateUserProfile = () => {
  const { update } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      userApiInstance.updateUserProfile(payload),
    onSuccess: (updatedFields) => {
      update(updatedFields);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateStudentProfile = () => {
  const { update } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStudentProfilePayload) =>
      userApiInstance.updateStudentProfile(payload),
    onSuccess: (updatedFields) => {
      update(updatedFields);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateStudentCV = () => {
  const { update } = useUserActions();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cvFile: File) => userApiInstance.updateStudentCV(cvFile),
    onSuccess: (updatedFields) => {
      update(updatedFields);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};
