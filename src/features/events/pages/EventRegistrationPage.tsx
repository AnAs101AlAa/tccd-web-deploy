import { useState, useRef, Activity } from "react";
import { FaX } from "react-icons/fa6";
import type Event from "@/shared/types/events";
import { useNavigate } from "react-router-dom";
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

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("Afternoon (2:00 PM - 6:00PM)");
  const [checkboxes, setCheckboxes] = useState<boolean[]>([false, false]);

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const fileBrowseRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  return (
    <WithLayout>
      <TicketRulesModal onClose={setShowRules} isOpen={showRules} />
      <div className="w-full lg:w-[80%] xl:w-2/3 mx-auto shadow-lg p-4 rounded-lg md:mt-10">
        <h2 className="text-2xl font-bold text-center mb-4 text-contrast">
          Event Registration Form
        </h2>
        <p className="text-center text-gray-700">
          Please fill out the form below to register for the event:{" "}
          <span className="font-semibold">{event.name}</span>
        </p>
        <hr className="my-3 border-gray-400" />
        {/*registration form grid flexes on overflow into one column*/}
        <div
          id="registrationForm"
          className="flex my-auto flex-wrap w-full h-fit md:gap-[4%] p-3"
        >
          {/*student main info section*/}
          <div className="text-sm flex flex-none flex-col md:w-[48%] gap-5 md:gap-7 w-full h-fit mb-6 xl:mb-0">
            <TextDisplayEdit
              label="Full Name in Arabic"
              value={storedUser.arabicFullName}
              disabled={true}
              placeholder="Please fill as shown in your ID"
            />
            <TextDisplayEdit
              label="Email Address"
              value={storedUser.email}
              disabled={true}
              placeholder="academic email preferred"
            />
            <TextDisplayEdit
              label="Graduation Year"
              value={storedUser.graduationYear.toString()}
              disabled={true}
              placeholder="e.g. 2024"
            />
            <TextDisplayEdit
              label="University"
              value={storedUser.university}
              disabled={true}
              placeholder="Please select your university"
            />
            {event.type === "Jobfair" && (
              <DropdownMenu
                label="Time Slot"
                value={selectedTimeSlot}
                options={[
                  {
                    label: "Morning (10:00 AM - 1:00 PM)",
                    value: "Morning (10:00 AM - 1:00 PM)",
                  },
                  {
                    label: "Afternoon (2:00 PM - 6:00PM)",
                    value: "Afternoon (2:00 PM - 6:00PM)",
                  },
                ]}
                onChange={(val) => setSelectedTimeSlot(val)}
              />
            )}
          </div>

          {/*student university info section*/}
          <div className="text-sm flex flex-none flex-col md:w-[48%] gap-5 lg:gap-7 w-full h-fit mb-6 xl:mb-0">
            <TextDisplayEdit
              label="Full Name in English"
              value={storedUser.englishFullName}
              disabled={true}
              placeholder="Please fill as shown in your ID"
            />
            <TextDisplayEdit
              label="Phone Number"
              value={storedUser.phoneNumber}
              disabled={true}
              placeholder="include country code e.g. +20xxxxxxxxxx"
            />
            <TextDisplayEdit
              label="GPA"
              value={storedUser.gpa.toString()}
              disabled={true}
              placeholder="on a 4.0 scale"
            />
            <TextDisplayEdit
              label="Faculty"
              value={storedUser.faculty}
              disabled={true}
              placeholder="Please select your faculty"
            />
            <Activity
              mode={storedUser.faculty === "Engineering" ? "visible" : "hidden"}
            >
              <TextDisplayEdit
                label="Department"
                value={storedUser.department}
                disabled={true}
                placeholder="Please select your department"
              />
            </Activity>
          </div>
        </div>

        <div className="w-full mb-6 md:mb-10 p-3">
          <p className="font-semibold">Attachments</p>
          <p className="text-[12px] font-semibold mb-1">
            Please upload the following (ID picture, CV, some stuff)
          </p>
          <div className="flex w-full border-2 border-[#a79d9d] rounded-lg">
            <div
              id="fileDisplay"
              className={`flex gap-[2%] overflow-x-auto w-full p-2 rounded-l-lg ${
                !files ? "bg-gray-100" : ""
              }`}
            >
              {files.length == 0 ? (
                <div className="text-[13px] px-2">No files selected</div>
              ) : (
                files.map((file, index) => (
                  <div
                    className="flex justify-between items-center bg-gray-300 whitespace-nowrap w-fit gap-1 md:gap-2 border rounded-sm text-[12px] px-2"
                    key={index}
                  >
                    <div>
                      {file.name.slice(0, Math.min(12, file.name.length))}
                    </div>
                    <FaX
                      strokeWidth={3}
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                      className="cursor-pointer size-2"
                    />
                  </div>
                ))
              )}
            </div>
            <input
              ref={fileBrowseRef}
              id="fileInput"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              className="whitespace-nowrap cursor-pointer rounded-r-md bg-[#cd3a38] text-white font-semibold px-2 text-[12px] border-l-1 border-[#a79d9d]"
              onClick={() => fileBrowseRef.current?.click()}
            >
              Browse files
            </button>
          </div>
        </div>

        {/*terms and conditions agreements*/}
        <div className="flex flex-col gap-2 px-3 border-b-2 pb-6 mb-6 border-gray-600">
          <Checkbox
            checked={checkboxes[0]}
            onChange={() => {
              const temp = [...checkboxes];
              temp[0] = !temp[0];
              setCheckboxes(temp);
            }}
            label="I agree to have my professional data shared with relevant companies for development and recruiting purposes"
          />
          <Checkbox
            checked={checkboxes[1]}
            onChange={() => {
              const temp = [...checkboxes];
              temp[1] = !temp[1];
              setCheckboxes(temp);
            }}
            label={
              <p className="text-sm leading-snug">
                I agree to the{" "}
                <span
                  onClick={() => setShowRules(true)}
                  className="text-secondary underline hover:text-secondary/80 cursor-pointer"
                  style={{
                    display: "inline",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  Ticket Admission And Cancellation Policy
                </span>
              </p>
            }
          />
        </div>

        {/*submit and clear buttons*/}
        <div className="w-fit mx-auto mb-4 flex gap-4">
          <Button
            type="primary"
            onClick={() => setIsSubmitting(true)}
            buttonText="Submit"
            width="small"
            loading={isSubmitting}
          />
          {!isSubmitting && (
            <Button
              type="secondary"
              onClick={() => navigate(-1)}
              buttonText="Cancel"
              width="small"
            />
          )}
        </div>
      </div>
    </WithLayout>
  );
}
