export interface EligibilityResponse {
  isEligible: boolean;
  reason?: string;
}

export interface RegistrationResponse {
  id: string;
  eventId: string;
  slotId: string;
  registeredAt: string;
}
