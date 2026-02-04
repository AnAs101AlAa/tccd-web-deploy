import { PastEventCard } from "@/features/events/components";
import { Button } from "tccd-ui";
import { MdEdit, MdDelete } from "react-icons/md";
import { useIsAdmin } from "@/shared/queries/user/userHooks";
import type Event from "@/shared/types/events";

interface AdminEventsListCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  isLoading?: boolean;
}

export default function AdminEventsListCard({
  event,
  onEdit,
  onDelete,
  isLoading = false,
}: AdminEventsListCardProps) {
  const isAdmin = useIsAdmin();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${event.name}"?`)) {
      onDelete(event.id);
    }
  };

  const handleEdit = () => {
    onEdit(event);
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Reuse PastEventCard from main events page */}
      <div className="flex-1">
        <PastEventCard event={event} />
      </div>

      {/* Admin action buttons - protected by RAC */}
      {isAdmin && (
        <div 
          className="flex gap-2 w-full"
          role="group"
          aria-label={`Admin actions for event: ${event.name}`}
        >
          <div className="flex-1" title={`Edit ${event.name}`}>
            <Button
              buttonText="Edit"
              buttonIcon={<MdEdit />}
              type="secondary"
              onClick={handleEdit}
              disabled={isLoading}
              aria-label={`Edit event: ${event.name}`}
            />
          </div>
          <div className="flex-1" title={`Delete ${event.name}`}>
            <Button
              buttonText="Delete"
              buttonIcon={<MdDelete />}
              type="danger"
              onClick={handleDelete}
              disabled={isLoading}
              aria-label={`Delete event: ${event.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}