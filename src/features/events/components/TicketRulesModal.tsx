import { Modal } from "tccd-ui";
import React from "react";

export default function TicketRulesModal({ onClose, isOpen }: { onClose: React.Dispatch<React.SetStateAction<boolean>>; isOpen: boolean }) {
    const ticketRules : string[] = [
        "Any ticket can be cancelled by admins at any time in case of detection of any unprofessional suspicious data submitted in the form associated with the ticket.",
        "Tickets can be cancelled by the user up to 48 hours before the event provided reason for cancellation.",
        "In case of a no show happening without prior cancellation of the ticket by the user, a penalty will be applied depending on recent activity of the user.",
        "Tickets are user specific and cannot be used by any other user. if a transfer is needed user should cancel their ticket and the other user should reserve their own ticket or contact TCCD for further assistance.",
    ]
    const attendanceRules :string[] = [
        'The attendee must show their ticket with the provided QR code at the entrance otherwise no entry will be allowed.',
        'In some cases the attendee might be asked to show their ID for verification purposes.',
        'The attendee must maintain professional behavior and respect the event rules and regulations otherwise a penalty or further actions will be taken.',
        "The attendee must follow guidelines provided by the event organizers and the event's hosts.",
    ]

    return (
        <Modal onClose={() => onClose(false)} isOpen={isOpen} title="Ticket Admission And Cancellation Policy">
            <div className="overflow-y-auto max-h-[40vh] py-2 p-5 bg-gray-100 rounded-xl">
                <p className="font-semibold lg:text-[18px] md:text-[16px] text-[14px] mb-1">Ticket Rules:</p>
                <ul className="list-disc pl-5">
                    {ticketRules.map((rule, index) => (
                        <li key={index} className="mb-2 lg:text-[16px] md:text-[14px] text-[12px]">{rule}</li>
                    ))}
                </ul>
                <p className="font-semibold lg:text-[20px] md:text-[16px] text-[14px] mb-1">Event Rules:</p>
                <ul className="list-disc pl-5">
                    {attendanceRules.map((rule, index) => (
                        <li key={index} className="mb-2 lg:text-[16px] md:text-[14px] text-[12px]">{rule}</li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
}