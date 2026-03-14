export interface EligibilityResponse {
  isEligible: boolean;
  message?: string;
}

export interface RegistrationResponse {
  id: string;
  eventId: string;
  slotId: string;
  registeredAt: string;
}
