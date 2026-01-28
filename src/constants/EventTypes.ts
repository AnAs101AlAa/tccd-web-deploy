import type { EventTypes, EventOrderBy } from "@/shared/types";
export const EVENT_SORT_OPTIONS = [
  {value: "Name" as EventOrderBy, label: "Name"},
  {value: "Date" as EventOrderBy, label: "Date"},
  {value: "Type" as EventOrderBy, label: "Type"},
  {value: "Location" as EventOrderBy, label: "Location"},
]
const EVENT_TYPES = [
  { value: "Workshop" as EventTypes, label: "Workshop" },
  { value: "Jobfair" as EventTypes, label: "Job Fair" },
  { value: "Researchday" as EventTypes, label: "Research Day" },
  { value: "Fieldtrip" as EventTypes, label: "Field Trip" },
  { value: "Sessions" as EventTypes, label: "Session" },
  { value: "Recruitment" as EventTypes, label: "Recruitment" },
  { value: "Orientation" as EventTypes, label: "Orientation" },
];

export const EVENT_TYPE_MAP = {
  Workshop: "Workshop",
  Jobfair: "Job Fair",
  Researchday: "Research Day",
  Fieldtrip: "Field Trip",
  Sessions: "Session",
  Recruitment: "Recruitment",
  Orientation: "Orientation",
};

export default EVENT_TYPES;
