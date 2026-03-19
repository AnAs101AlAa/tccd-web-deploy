import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VolunteerApi }  from "./volunteerApi";

const volunteerApi = new VolunteerApi();

const volunteerQueryKey = ["admin", "volunteers"];
const usersQueryKey = ["admin", "users"];

export const useAddVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...volunteerQueryKey, "add"],
    mutationFn: ({ committee, position, userId }: { committee: string; position: string; userId: string }) =>
      volunteerApi.addVolunteer(committee, position, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerQueryKey });
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
};

export const useEditVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...volunteerQueryKey, "edit"],
    mutationFn: ({ userId, committee, position }: { userId: string; committee: string; position: string }) =>
      volunteerApi.editVolunteer(userId, committee, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      queryClient.invalidateQueries({ queryKey: volunteerQueryKey });
    }
  });
}

export const useDeleteVolunteer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...volunteerQueryKey, "delete"],
    mutationFn: (userId: string) => volunteerApi.deleteVolunteer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      queryClient.invalidateQueries({ queryKey: volunteerQueryKey });
    }
  });
};

