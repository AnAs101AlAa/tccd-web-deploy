import { useQuery } from "@tanstack/react-query";
import { statsApi } from "./statsApi";
import type { StatsRole } from "./types";

export const statsKeys = {
  all: ["stats"] as const,
  usersGender: (role?: StatsRole) => [...statsKeys.all, "users", "gender", role] as const,
  usersStatus: () => [...statsKeys.all, "users", "status"] as const,
  usersGraduationYear: () => [...statsKeys.all, "users", "graduation-year"] as const,
  usersFaculties: () => [...statsKeys.all, "users", "faculties"] as const,
  usersUniversities: () => [...statsKeys.all, "users", "universities"] as const,
  usersDepartments: () => [...statsKeys.all, "users", "departments"] as const,
  usersGpaDistribution: () => [...statsKeys.all, "users", "gpa-distribution"] as const,
  eventOverview: (eventId: string) => [...statsKeys.all, "events", eventId, "overview"] as const,
  eventGender: (eventId: string) => [...statsKeys.all, "events", eventId, "gender"] as const,
  eventUniversity: (eventId: string) => [...statsKeys.all, "events", eventId, "university"] as const,
  eventDepartment: (eventId: string, university?: string) =>
    [...statsKeys.all, "events", eventId, "department", university] as const,
  committeesDistribution: () => [...statsKeys.all, "committees", "distribution"] as const,
  companiesBusinessReps: () => [...statsKeys.all, "companies", "business-representatives"] as const,
};

export const useGetUsersGenderStats = (role?: StatsRole) => {
  return useQuery({
    queryKey: statsKeys.usersGender(role),
    queryFn: () => statsApi.getUsersGenderStats(role),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsersStatusStats = () => {
  return useQuery({
    queryKey: statsKeys.usersStatus(),
    queryFn: () => statsApi.getUsersStatusStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetEventOverviewStats = (eventId: string) => {
  return useQuery({
    queryKey: statsKeys.eventOverview(eventId),
    queryFn: () => statsApi.getEventOverviewStats(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetEventGenderDistributionStats = (eventId: string) => {
  return useQuery({
    queryKey: statsKeys.eventGender(eventId),
    queryFn: () => statsApi.getEventGenderDistributionStats(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetEventUniversityDistributionStats = (eventId: string) => {
  return useQuery({
    queryKey: statsKeys.eventUniversity(eventId),
    queryFn: () => statsApi.getEventUniversityDistributionStats(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetEventDepartmentAttendanceStats = (
  eventId: string,
  university?: string,
) => {
  return useQuery({
    queryKey: statsKeys.eventDepartment(eventId, university),
    queryFn: () => statsApi.getEventDepartmentAttendanceStats(eventId, university),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCommitteesDistributionStats = () => {
  return useQuery({
    queryKey: statsKeys.committeesDistribution(),
    queryFn: () => statsApi.getCommitteesDistributionStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsersGraduationYearStats = () => {
  return useQuery({
    queryKey: statsKeys.usersGraduationYear(),
    queryFn: () => statsApi.getUsersGraduationYearStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsersFacultiesStats = () => {
  return useQuery({
    queryKey: statsKeys.usersFaculties(),
    queryFn: () => statsApi.getUsersFacultiesStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsersUniversitiesStats = () => {
  return useQuery({
    queryKey: statsKeys.usersUniversities(),
    queryFn: () => statsApi.getUsersUniversitiesStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsersDepartmentsStats = () => {
  return useQuery({
    queryKey: statsKeys.usersDepartments(),
    queryFn: () => statsApi.getUsersDepartmentsStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUsersGpaDistributionStats = () => {
  return useQuery({
    queryKey: statsKeys.usersGpaDistribution(),
    queryFn: () => statsApi.getUsersGpaDistributionStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCompaniesBusinessRepresentativesStats = () => {
  return useQuery({
    queryKey: statsKeys.companiesBusinessReps(),
    queryFn: () => statsApi.getCompaniesBusinessRepresentativesStats(),
    staleTime: 5 * 60 * 1000,
  });
};
