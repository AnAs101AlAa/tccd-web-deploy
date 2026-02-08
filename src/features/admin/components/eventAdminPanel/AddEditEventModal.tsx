import {
  Modal,
  InputField,
  TextAreaField,
  DropdownMenu,
  Button,
  SearchField,
  Checkbox,
  DateTimePicker
} from "tccd-ui";
import EVENT_TYPES from "@/constants/EventTypes";
import type Event from "@/shared/types/events";
import { FaPlus, FaCheck } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import useEventModalUtils from "../../utils/eventModalUtils";

interface AddEditEventModalProps {
  event?: Event;
  onClose: () => void;
}

const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  event,
  onClose,
}) => {

  const {
    formValues,
    setFormValues,
    handleInputChange,
    errors,
    locations,
    isSubmitting,
    locationsLoading,
    locationNameKey,
    setLocationNameKey,
    isEditMode,
    isAddingMedia,
    setIsAddingMedia,
    currentMediaInput,
    setCurrentMediaInput,
    handleAddMedia,
    handleRemoveNewMedia,
    handleRemoveOriginalMedia,
    handleSave,
    originalMedia,
    newMediaIds,
    deletedMediaIds,
  } = useEventModalUtils({ event, onClose });

  return (
    <Modal
      title={isEditMode ? "Edit Event" : "Add New Event"}
      isOpen
      onClose={() => { if (!isSubmitting) onClose() }}
      className="max-w-4xl"
    >
      <div>
        <p className="text-md font-semibold">
          {'A) Preliminary information'}
        </p>
        <hr className="border-gray-300 mt-1 mb-3" />
        <div className="space-y-3">
          <div className="space-y-2">
            <InputField
              label="Title"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              value={formValues.name || ""}
              placeholder="Enter event title"
              onChange={(e) => handleInputChange("name", e.target.value)}
              id="title"
              error={errors.name}
            />
            {errors.name && <p className="px-1 text-xs text-primary">
              {errors.name}
            </p>}
          </div>

          <div className="space-y-2">
            <TextAreaField
              label="Description"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              value={formValues.description || ""}
              placeholder="Enter detailed event description"
              onChange={(e) => handleInputChange("description", e.target.value)}
              id="description"
              maxLength={1000}
              error={errors.description}
            />
            {errors.description && <p className="-mt-2 px-1 text-xs text-primary">
              {errors.description}
            </p>}
          </div>

          <div className="space-y-2">
            <DateTimePicker
              id="date"
              labelClassName="text-[13px] md:text-[14px] xl:text-[15px] text-gray-600 mb-1"
              label="Event Date & Time"
              value={formValues.date ? new Date(formValues.date).getTime() : null}
              onChange={(timestamp: number) => handleInputChange("date", timestamp)}
              error={errors.date}
            />
            {errors.date && <p className="px-1 text-xs text-primary">
              {errors.date}
            </p>}
          </div>

          {/* <div className="md:col-span-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-contrast">
                  Event Sponsors (Optional)
                </label>
                <div className="border border-gray-200 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                  {AVAILABLE_SPONSORS.map((sponsor) => (
                    <label
                      key={sponsor.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formValues.sponsors.includes(sponsor.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            handleSponsorsChange([
                              ...formValues.sponsors,
                              sponsor.id,
                            ]);
                          } else {
                            handleSponsorsChange(
                              formValues.sponsors.filter(
                                (id: string) => id !== sponsor.id
                              )
                            );
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 flex items-center space-x-3">
                        <img
                          src={sponsor.banner}
                          alt={sponsor.companyName}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {sponsor.companyName}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {formValues.sponsors.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {formValues.sponsors.length} sponsor(s) selected
                  </p>
                )}
              </div>
          </div> */}

          <div className="space-y-2">
            <DropdownMenu
              label="Event Type"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              options={EVENT_TYPES}
              value={formValues.type}
              onChange={(val) => handleInputChange("type", val)}
              placeholder="Select event type"
              id="eventType"
            />
            {errors.type && <p className="px-1 text-xs text-primary">
              {errors.type}
            </p>}
          </div>
        </div>
        <p className="text-md font-semibold mt-6">
          {'B) Location information'}
        </p>
        <hr className="border-gray-300 mt-1 mb-3" />
        <div className="space-y-3">
          <div className="space-y-3">
            <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600">
              Event Locations
            </p>
            <SearchField
              placeholder="Search locations..."
              value={locationNameKey || ""}
              onChange={(val) => setLocationNameKey(val || undefined)}
              className="lg:w-full"
            />
            <div className="max-h-48 overflow-y-auto border border-gray-400 rounded-2xl p-2">
              {locationsLoading ? (
                <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">Loading locations...</p>
              ) : (
                <>
                  {locations && locations.length > 0 ? (
                    locations.map((loc) => (
                      <div
                        key={loc.id}
                        className="p-3 cursor-pointer hover:bg-gray-50 flex items-center"
                      >
                        <Checkbox
                          label=""
                          checked={Array.isArray(formValues.locations) && formValues.locations.includes(loc.id)}
                          onChange={() => {
                            setFormValues((prev) => {
                              const currentLocations = Array.isArray(prev.locations) ? prev.locations : [];
                              const isSelected = currentLocations.includes(loc.id);
                              const newLocations = isSelected
                                ? currentLocations.filter((id) => id !== loc.id)
                                : [...currentLocations, loc.id];
                              const newCapacity = isSelected
                                ? prev.capacity - loc.capacity
                                : prev.capacity + loc.capacity;
                              return {
                                ...prev,
                                locations: newLocations,
                                capacity: newCapacity < 0 ? 0 : newCapacity,
                              };
                            });
                          }}
                        />
                        <div className="flex-1 flex gap-2 items-center">
                          <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-contrast">{loc.name}</p>
                          <p className="text-sm text-gray-500">Capacity: {loc.capacity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">No locations found.</p>
                  )}
                </>
              )}
            </div>
            <div className="space-y-2">
              <InputField
                label="Total capacity"
                value={formValues.capacity.toString()}
                placeholder="Capacity of selected locations combined"
                onChange={() => { }}
                id="capacity"
                error={errors.locations}
              />
              {errors.locations && <p className="px-1 text-xs text-primary">
                {errors.locations}
              </p>}
            </div>
          </div>
        </div>
        <p className="text-md font-semibold mt-6">
          {'C) Event media'}
        </p>
        <hr className="border-gray-300 mt-1 mb-3" />
        <div className="space-y-3">
          <div className="space-y-2">
            <InputField
              label="Event Poster Drive ID"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              value={formValues.eventImage || ""}
              placeholder="Enter Google Drive file ID (e.g., 1mZpgvii35XVK3VnvX49YRO80NeXCaBrD)"
              onChange={(e) => handleInputChange("eventImage", e.target.value)}
              id="eventImage"
              error={errors.eventImage}
            />
            {errors.eventImage && <p className="px-1 text-xs text-primary">
              {errors.eventImage}
            </p>}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600">
                Additional Media Drive IDs (Optional)
              </p>
              <Button
                buttonIcon={<FaPlus className="size-3" />}
                className="py-1 md:py-2 px-3 md:px-4"
                type="primary"
                width="fit"
                onClick={() => setIsAddingMedia(true)}
              />
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-400 rounded-2xl p-2 space-y-2">
              {(() => {
                const visibleOriginalMedia = originalMedia?.filter((media: any) => !deletedMediaIds.includes(media.id)) || [];
                const hasVisibleMedia = visibleOriginalMedia.length > 0 || newMediaIds.length > 0 || isAddingMedia;

                return hasVisibleMedia ? (
                  <>
                    {/* Existing media from API (read-only, can delete) */}
                    {visibleOriginalMedia.map((media: any) => {
                      const driveId = media.mediaUrl ? media.mediaUrl.match(/\/d\/([^\/\?]+)/)?.[1] || media.mediaUrl : '';
                      return (
                        <div key={media.id} className="p-2 border border-gray-300 rounded-2xl bg-gray-50">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs text-gray-500 font-medium">Existing:</span>
                              <span className="text-sm text-gray-700 truncate">{driveId}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveOriginalMedia(media.id)}
                              className="text-contrast hover:text-primary cursor-pointer flex-shrink-0"
                              title="Mark for deletion"
                            >
                              <TbTrash className="size-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Newly added media (can delete before saving) */}
                    {newMediaIds.map((mediaId, index) => (
                      <div key={`new-${index}`} className="p-2 border border-gray-300 rounded-2xl bg-blue-50">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs text-blue-600 font-medium">New:</span>
                            <span className="text-sm text-gray-700 truncate">{mediaId}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveNewMedia(index)}
                            className="text-contrast hover:text-primary cursor-pointer flex-shrink-0"
                          >
                            <TbTrash className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {isAddingMedia && (
                      <div className="flex items-center gap-2">
                        <InputField
                          label=""
                          labelClassName="hidden"
                          value={currentMediaInput}
                          placeholder="Enter Google Drive file ID"
                          onChange={(e) => setCurrentMediaInput(e.target.value)}
                          id="mediaUrl"
                        />
                        <Button
                          buttonIcon={<FaCheck className="size-3" />}
                          className="px-2 md:px-3"
                          type="primary"
                          width="fit"
                          onClick={() => {
                            if (currentMediaInput.trim() !== "") {
                              handleAddMedia(currentMediaInput.trim());
                              setCurrentMediaInput("");
                              setIsAddingMedia(false);
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">No additional media added.</p>
                );
              })()}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-300 mt-6">
          <Button
            disabled={isSubmitting}
            buttonText="Cancel"
            onClick={onClose}
            type="basic"
            width="fit"
          />
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            buttonText={isEditMode ? "Save Changes" : "Create Event"}
            onClick={handleSave}
            type="primary"
            width="fit"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditEventModal;
