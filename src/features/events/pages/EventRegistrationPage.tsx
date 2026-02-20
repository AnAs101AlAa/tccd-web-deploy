import { useState, Activity } from "react";
import {
  FaCalendar,
  FaMapPin,
  FaUsers,
  FaArrowLeft,
  FaArrowRight,
  FaCircleCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox, LoadingPage, ErrorScreen } from "tccd-ui";
import toast from "react-hot-toast";
import WithLayout from "@/shared/components/hoc/WithLayout";
import type { StudentUser } from "@/shared/types";
import { TextDisplayEdit, DropdownMenu, Button } from "tccd-ui";
import { TicketRulesModal } from "../components";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import { useEventRegistration } from "../hooks";

/**
 * Creates a Zod schema for the registration form.
 * The `slotId` field is conditionally required based on whether the event has slots.
 */
const createRegistrationSchema = (hasSlots: boolean) =>
  z.object({
    slotId: hasSlots
      ? z.string().min(1, "Please select a time slot")
      : z.string().optional(),
  });

type RegistrationFormData = z.infer<
  ReturnType<typeof createRegistrationSchema>
>;

export default function EventRegisterForm() {
  const { id } = useParams<{ id: string }>();
  const eventId = id ?? "";
  const storedUser = useSelector(
    (state: { user: { currentUser: StudentUser } }) => state.user.currentUser,
  );

  const {
    event,
    hasSlots,
    slotOptions,
    isLoading,
    error,
    isEligible,
    eligibilityReason,
    register,
    isRegistering,
    isRegistered,
  } = useEventRegistration(eventId);

  const { control, handleSubmit } = useForm<RegistrationFormData>({
    resolver: zodResolver(createRegistrationSchema(hasSlots)),
    mode: "onChange",
    defaultValues: {
      slotId: "",
    },
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [checkboxes, setCheckboxes] = useState<boolean[]>([false, false]);
  const [showRules, setShowRules] = useState<boolean>(false);

  const totalSteps = 3;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !event) {
    return (
      <WithLayout>
        <ErrorScreen
          message={getErrorMessage(error)}
          title="Failed to load event details."
        />
      </WithLayout>
    );
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data: RegistrationFormData) => {
    // Resolve slot: user-selected > first available slot
    const slotId = data.slotId || event.slots?.[0]?.id;
    if (!slotId) {
      toast.error("No time slot available, cannot register.");
      return; // No slot available — cannot register
    }
    register(slotId);
  };

  const capacityUsage = (event.registeredCount / event.capacity) * 100;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <WithLayout>
      <TicketRulesModal onClose={setShowRules} isOpen={showRules} />
      <div className="w-full mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Registration Success State */}
          {isRegistered && (
            <div className="mb-8 bg-white rounded-xl p-8 shadow-md border border-green-200 text-center">
              <FaCircleCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Registration Successful!
              </h2>
              <p className="text-sm text-muted-foreground">
                You have been successfully registered for{" "}
                <span className="font-semibold">{event.name}</span>.
              </p>
            </div>
          )}

          {/* Eligibility Warning */}
          {!isEligible && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <FaTriangleExclamation className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  You are not eligible to register for this event.
                </p>
                {eligibilityReason && (
                  <p className="text-xs text-amber-700 mt-1">
                    {eligibilityReason}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Hero Event Card */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg bg-white border border-slate-200">
            <div className="relative h-48 md:h-56 overflow-hidden">
              <img
                src={event.eventImage || "/placeholder.svg"}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {event.name}
                </h1>
                <div className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.type}
                </div>
              </div>
            </div>

            {/* Event Metadata Grid */}
            <div className="p-6 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Date & Time
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formattedDate} • {formattedTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {event.locations[0]}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUsers className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      Spots Available
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {event.registeredCount}/{event.capacity} Registered
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Capacity Usage
                  </p>
                  <p className="text-xs font-bold text-primary">
                    {Math.round(capacityUsage)}%
                  </p>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                    style={{ width: `${capacityUsage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Progress Indicator Card */}
          <div className="mb-8 bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-lg">
                Step {currentStep} of {totalSteps}
              </h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200  rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-4 font-semibold uppercase tracking-wider">
              <span className={currentStep >= 1 ? "text-primary" : ""}>
                Personal Info
              </span>
              <span className={currentStep >= 2 ? "text-primary" : ""}>
                Academic
              </span>
              <span className={currentStep >= 3 ? "text-primary" : ""}>
                Confirm
              </span>
            </div>
          </div>
          {/* Form Content Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
            {/* Step 1: Personal Information */}
            <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
              <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Personal Information
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Your basic registration details
                </p>

                <div className="space-y-6">
                  {/* Two Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Full Name (Arabic)
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.arabicFullName}
                        disabled={true}
                        placeholder="كامل اسمك"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Full Name (English)
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.englishFullName}
                        disabled={true}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Email Address
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.email}
                        disabled={true}
                        placeholder="your.email@university.edu"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Phone Number
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.phoneNumber}
                        disabled={true}
                        placeholder="+20 123 456 7890"
                      />
                    </div>
                  </div>

                  <div
                    className={`grid grid-cols-1 ${hasSlots ? "md:grid-cols-2" : ""} gap-4 md:gap-6`}
                  >
                    {/* University */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        University
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.university}
                        disabled={true}
                        placeholder="Select your university"
                      />
                    </div>

                    {/* Time Slot — Data-driven: only shown if event has slots */}
                    {hasSlots && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          Preferred Time Slot
                        </label>
                        <Controller
                          name="slotId"
                          control={control}
                          render={({
                            field,
                            fieldState: { error: fieldError },
                          }) => (
                            <DropdownMenu
                              label=""
                              value={field.value || ""}
                              options={slotOptions}
                              onChange={(val) => field.onChange(val)}
                              error={fieldError?.message}
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Activity>

            {/* Step 2: Academic Information */}
            <Activity mode={currentStep === 2 ? "visible" : "hidden"}>
              <div className="p-6 md:p-8 border-b border-slate-200">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Academic Information
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Your educational background
                </p>

                <div className="space-y-6">
                  {/* Graduation Year and GPA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Graduation Year
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.graduationYear?.toString() || ""}
                        disabled={true}
                        placeholder="e.g. 2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        GPA
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.gpa?.toString() || ""}
                        disabled={true}
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>

                  {/* Faculty */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">
                      Faculty
                    </label>
                    <TextDisplayEdit
                      label=""
                      value={storedUser.faculty}
                      disabled={true}
                      placeholder="Select your faculty"
                    />
                  </div>

                  {/* Conditional Department Field */}
                  <Activity
                    mode={
                      storedUser.faculty === "Engineering"
                        ? "visible"
                        : "hidden"
                    }
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Department
                      </label>
                      <TextDisplayEdit
                        label=""
                        value={storedUser.department}
                        disabled={true}
                        placeholder="Select your department"
                      />
                    </div>
                  </Activity>
                </div>
              </div>
            </Activity>

            {/* Step 3: Terms & Agreements */}
            <Activity mode={currentStep === 3 ? "visible" : "hidden"}>
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Terms & Agreements
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Review and accept our terms to complete your registration
                </p>

                <div className="space-y-6">
                  {/* Agreements Section */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-foreground">
                      Accept our Terms & Policies
                    </p>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <Checkbox
                        checked={checkboxes[0]}
                        onChange={() => {
                          const temp = [...checkboxes];
                          temp[0] = !temp[0];
                          setCheckboxes(temp);
                        }}
                        label={
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            I agree to have my professional data shared with
                            relevant companies for development and recruiting
                            purposes
                          </span>
                        }
                      />
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <Checkbox
                        checked={checkboxes[1]}
                        onChange={() => {
                          const temp = [...checkboxes];
                          temp[1] = !temp[1];
                          setCheckboxes(temp);
                        }}
                        label={
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            I agree to the{" "}
                            <button
                              type="button"
                              onClick={() => setShowRules(true)}
                              className="text-secondary font-semibold hover:underline transition-colors inline"
                            >
                              Ticket Admission and Cancellation Policy
                            </button>
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Activity>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="secondary"
              onClick={handlePreviousStep}
              buttonText="Previous"
              buttonIcon={<FaArrowLeft className="w-4 h-4" />}
              width="auto"
              disabled={currentStep === 1}
            />

            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Step {currentStep} / {totalSteps}
            </div>

            {currentStep === totalSteps ? (
              <Button
                type="primary"
                onClick={handleSubmit(onSubmit)}
                buttonText={
                  isRegistering ? "Submitting..." : "Submit Registration"
                }
                width="auto"
                loading={isRegistering}
                disabled={
                  !checkboxes[0] ||
                  !checkboxes[1] ||
                  !isEligible ||
                  isRegistered
                }
              />
            ) : (
              <Button
                type="primary"
                onClick={handleNextStep}
                buttonText="Next"
                buttonIcon={<FaArrowRight className="w-4 h-4" />}
                width="auto"
              />
            )}
          </div>
        </div>
      </div>
    </WithLayout>
  );
}
