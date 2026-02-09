import React from "react";

import { useState, useRef, Activity } from "react";
import {
  FaX,
  FaCheck,
  FaCalendar,
  FaMapPin,
  FaUsers,
  FaFileArrowUp,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa6";
import type Event from "@/shared/types/events";
import { useSelector } from "react-redux";
import { Checkbox } from "tccd-ui";
import WithLayout from "@/shared/components/hoc/WithLayout";
import type { StudentUser } from "@/shared/types";
import { TextDisplayEdit, DropdownMenu, Button } from "tccd-ui";
import { TicketRulesModal } from "../components";

export default function EventRegisterForm() {
  const storedUser = useSelector((state: { user: StudentUser }) => state.user);
  const event: Event = {
    id: "1",
    name: "Web Development Workshop",
    description:
      "Learn modern web development with React and TypeScript. This hands-on workshop will cover the fundamentals of building responsive web applications.",
    eventMedia: [],
    registrationDeadline: "2025-10-20T23:59:00Z",
    eventImage:
      "https://images.unsplash.com/photo-1760340769739-653d00200baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    date: "2025-10-25T14:00:00Z",
    locations: ["Tech Lab, Building A"],
    type: "Workshop",
    capacity: 50,
    isApproved: true,
    registeredCount: 35,
    attendeeCount: 0,
  }; //useSelector((state: {event: Event}) => state.event);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    "Afternoon (2:00 PM - 6:00PM)",
  );
  const [checkboxes, setCheckboxes] = useState<boolean[]>([false, false]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const fileBrowseRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const totalSteps = 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const capacityUsage = (event.registeredCount / event.capacity) * 100;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <WithLayout>
      <TicketRulesModal onClose={setShowRules} isOpen={showRules} />
      <div className="w-full mx-auto min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
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
                      Oct 25, 2025 • 2:00 PM
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

                  {/* Time Slot for Jobfairs */}
                  <Activity
                    mode={event.type === "Jobfair" ? "visible" : "hidden"}
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">
                        Preferred Time Slot
                      </label>
                      <DropdownMenu
                        label=""
                        value={selectedTimeSlot}
                        options={[
                          {
                            label: "Morning (10:00 AM - 1:00 PM)",
                            value: "Morning (10:00 AM - 1:00 PM)",
                          },
                          {
                            label: "Afternoon (2:00 PM - 6:00 PM)",
                            value: "Afternoon (2:00 PM - 6:00 PM)",
                          },
                        ]}
                        onChange={(val) => setSelectedTimeSlot(val)}
                      />
                    </div>
                  </Activity>
                </div>
              </div>
            </Activity>

            {/* Step 3: Documents & Agreements */}
            <Activity mode={currentStep === 3 ? "visible" : "hidden"}>
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  Documents & Agreements
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Upload required documents and accept terms
                </p>

                <div className="space-y-6">
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FaFileArrowUp className="w-4 h-4 text-primary" />
                      Required Documents
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Please upload your ID picture, CV, and relevant
                      certificates
                    </p>

                    {/* Drag and Drop Area */}
                    <div
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => fileBrowseRef.current?.click()}
                    >
                      <FaFileArrowUp className="w-8 h-8 mx-auto mb-3 text-primary/60" />
                      <p className="font-semibold text-foreground mb-1">
                        Drag files here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF, DOC, JPG, PNG (Max 10MB each)
                      </p>
                    </div>

                    <input
                      ref={fileBrowseRef}
                      id="fileInput"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Files List */}
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          {files.length} file{files.length !== 1 ? "s" : ""}{" "}
                          selected
                        </p>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-secondary/10 border border-secondary/30 rounded-lg hover:bg-secondary/15 transition-colors group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FaCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground truncate">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setFiles(files.filter((_, i) => i !== index))
                                }
                                className="ml-2 p-1.5 hover:bg-secondary/30 rounded-md transition-colors flex-shrink-0"
                              >
                                <FaX className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Agreements Section */}
                  <div className="border-t border-slate-200 pt-6 space-y-4">
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
                onClick={() => setIsSubmitting(true)}
                buttonText={
                  isSubmitting ? "Submitting..." : "Submit Registration"
                }
                width="auto"
                loading={isSubmitting}
                disabled={!checkboxes[0] || !checkboxes[1]}
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
