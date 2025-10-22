import type { AnyUser } from "@/shared/types";
import {
  isStudent,
  isVolunteer,
  isCompany,
  isBusinessRep,
  isTA,
  isDR,
} from "@/shared/types";

export interface Tab {
  id: string;
  label: string;
}

export const STUDENT_VOLUNTEER_TABS: Tab[] = [
  { id: "info", label: "Info" },
  { id: "tickets", label: "Tickets" },
];

export const COMPANY_TABS: Tab[] = [
  { id: "info", label: "Info" },
  { id: "offerings", label: "Offerings" },
];

export const BUSINESS_REP_TABS: Tab[] = [{ id: "info", label: "Info" }];

export const DEFAULT_TABS: Tab[] = [{ id: "info", label: "Info" }];

export const getUserTabs = (user: AnyUser): Tab[] => {
  if (isStudent(user) || isVolunteer(user)) {
    return STUDENT_VOLUNTEER_TABS;
  }

  if (isCompany(user)) {
    return COMPANY_TABS;
  }

  if (isBusinessRep(user) || isTA(user) || isDR(user)) {
    return BUSINESS_REP_TABS;
  }

  return DEFAULT_TABS;
};
