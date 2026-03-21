import { systemApi } from "../../AxoisInstance";
import type {
  StatsApiResponse,
  StatsRole,
  UsersGenderStats,
  UsersStatusItem,
  EventOverviewStats,
  EventGenderDistributionStats,
  EventUniversityDistributionStats,
  EventDepartmentAttendanceStats,
  CommitteesDistributionStats,
  UsersGraduationYearStats,
  UsersFacultiesStats,
  UsersUniversitiesStats,
  UsersDepartmentsStats,
  UsersGpaDistributionStats,
  CompaniesBusinessRepresentativesStats,
} from "./types";

const STATS_ROUTE = "/v1/stats";

export class StatsApi {
  async getUsersGenderStats(role?: StatsRole): Promise<UsersGenderStats> {
    const response = await systemApi.get<StatsApiResponse<UsersGenderStats>>(
      `${STATS_ROUTE}/users/gender`,
      {
        params: role ? { Role: role } : undefined,
      },
    );
    return response.data.data;
  }

  async getUsersStatusStats(): Promise<UsersStatusItem[]> {
    const response = await systemApi.get<StatsApiResponse<UsersStatusItem[]>>(
      `${STATS_ROUTE}/users/status`,
    );
    return response.data.data;
  }

  async getEventOverviewStats(eventId: string): Promise<EventOverviewStats> {
    const response = await systemApi.get<StatsApiResponse<EventOverviewStats>>(
      `${STATS_ROUTE}/events/${eventId}`,
    );
    return response.data.data;
  }

  async getEventGenderDistributionStats(
    eventId: string,
  ): Promise<EventGenderDistributionStats> {
    try {
      const response =
        await systemApi.get<StatsApiResponse<EventGenderDistributionStats>>(
          `${STATS_ROUTE}/events/${eventId}/gender`,
        );
      return response.data.data;
    } catch {
      const fallbackResponse =
        await systemApi.get<StatsApiResponse<EventGenderDistributionStats>>(
          `${STATS_ROUTE}/evnets/${eventId}/gender`,
        );
      return fallbackResponse.data.data;
    }
  }

  async getEventUniversityDistributionStats(
    eventId: string,
  ): Promise<EventUniversityDistributionStats> {
    const response =
      await systemApi.get<StatsApiResponse<EventUniversityDistributionStats>>(
        `${STATS_ROUTE}/events/${eventId}/university`,
      );
    return response.data.data;
  }

  async getEventDepartmentAttendanceStats(
    eventId: string,
    department?: string,
  ): Promise<EventDepartmentAttendanceStats> {
    const response =
      await systemApi.get<StatsApiResponse<EventDepartmentAttendanceStats>>(
        `${STATS_ROUTE}/events/${eventId}/department`,
        {
          params: department ? { department } : undefined,
        },
      );
    return response.data.data;
  }

  async getCommitteesDistributionStats(): Promise<CommitteesDistributionStats> {
    const response =
      await systemApi.get<StatsApiResponse<CommitteesDistributionStats>>(
        `${STATS_ROUTE}/committees/distribution`,
      );
    return response.data.data;
  }

  async getUsersGraduationYearStats(): Promise<UsersGraduationYearStats> {
    const response =
      await systemApi.get<StatsApiResponse<UsersGraduationYearStats>>(
        `${STATS_ROUTE}/users/graduation-year`,
      );
    return response.data.data;
  }

  async getUsersFacultiesStats(): Promise<UsersFacultiesStats> {
    const response = await systemApi.get<StatsApiResponse<UsersFacultiesStats>>(
      `${STATS_ROUTE}/users/faculties`,
    );
    return response.data.data;
  }

  async getUsersUniversitiesStats(): Promise<UsersUniversitiesStats> {
    const response =
      await systemApi.get<StatsApiResponse<UsersUniversitiesStats>>(
        `${STATS_ROUTE}/users/universities`,
      );
    return response.data.data;
  }

  async getUsersDepartmentsStats(): Promise<UsersDepartmentsStats> {
    const response =
      await systemApi.get<StatsApiResponse<UsersDepartmentsStats>>(
        `${STATS_ROUTE}/users/departments`,
      );
    return response.data.data;
  }

  async getUsersGpaDistributionStats(): Promise<UsersGpaDistributionStats> {
    const response =
      await systemApi.get<StatsApiResponse<UsersGpaDistributionStats>>(
        `${STATS_ROUTE}/users/gpa-distribution`,
      );
    return response.data.data;
  }

  async getCompaniesBusinessRepresentativesStats(): Promise<CompaniesBusinessRepresentativesStats> {
    const response =
      await systemApi.get<StatsApiResponse<CompaniesBusinessRepresentativesStats>>(
        `${STATS_ROUTE}/companies/business-representatives`,
      );
    return response.data.data;
  }
}

export const statsApi = new StatsApi();
