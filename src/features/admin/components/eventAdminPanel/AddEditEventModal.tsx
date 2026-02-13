import {
  Modal,
  InputField,
  DropdownMenu,
  Button,
  SearchField,
  Checkbox,
  DateTimePicker,
  Timepicker
} from "tccd-ui";
import EVENT_TYPES from "@/constants/EventTypes";
import type Event from "@/shared/types/events";
import { FaPlus, FaCheck } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import useEventModalUtils from "../../utils/eventModalUtils";
import type { Company } from "@/shared/types/companies";
import type { EventSlot } from "@/shared/types/events";
import format from "@/shared/utils/dateFormater";
import { RichTextEditor } from "@/shared/components/RichTextEditor";

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
    companiesLoading,
    companyNameKey,
    setCompanyNameKey,
    companies,
    isEditMode,
    isAddingMedia,
    isAddingSlot,
    setIsAddingSlot,
    currentSlotInput,
    setCurrentSlotInput,
    setIsAddingMedia,
    currentMediaInput,
    setCurrentMediaInput,
    handleAddMedia,
    handleRemoveNewMedia,
    handleRemoveOriginalMedia,
    handleAddSlot,
    handleRemoveSlot,
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
      className="lg:max-w-none xl:max-w-none lg:w-4/5 xl:w-3/4"
    >
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-0 lg:gap-4">
        <div className="w-full">
          <p className="text-md font-semibold">
            {'Preliminary information'}
          </p>
          <hr className="border-gray-300 mt-1 mb-3" />
          <div className="space-y-3">
            <InputField
              label="Title"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              value={formValues.name || ""}
              placeholder="Enter event title"
              onChange={(e) => handleInputChange("name", e.target.value)}
              id="title"
              error={errors.name}
            />

            <RichTextEditor
              label="Description"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              value={formValues.description || ""}
              placeholder="Enter detailed event description"
              onChange={(value) => handleInputChange("description", value)}
              id="description"
              maxLength={1000}
              error={errors.description}
              errorClassName="-mt-1"
            />

            <DateTimePicker
              id="date"
              labelClassName="text-[13px] md:text-[14px] xl:text-[15px] text-gray-600 mb-1"
              label="Event Date & Time"
              value={formValues.date ? new Date(formValues.date).getTime() : null}
              onChange={(timestamp: number) => handleInputChange("date", timestamp)}
              error={errors.date}
            />
            <DropdownMenu
              label="Event Type"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              options={EVENT_TYPES}
              value={formValues.type}
              onChange={(val) => handleInputChange("type", val)}
              placeholder="Select event type"
              id="eventType"
            />
          </div>
        </div>
        <div className="w-full mt-6 lg:mt-0">
          <p className="text-md font-semibold">
            {'Location information'}
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
              <div className="h-48 lg:h-56 overflow-y-auto border border-gray-400 rounded-2xl p-2">
                {locationsLoading ? (
                  <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">Loading locations...</p>
                ) : (
                  <>
                    {locations && locations.length > 0 ? (
                      locations.map((loc) => (
                        <div
                          key={loc.id}
                          className="p-3 border-b border-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-50 flex items-center"
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
                <InputField
                  label="Total capacity"
                  value={formValues.capacity.toString()}
                  placeholder="Capacity of selected locations combined"
                  onChange={() => { }}
                  id="capacity"
                  error={errors.locations}
                />
            </div>
          </div>
        </div>
        <div className="w-full mt-6 lg:mt-0">
          <p className="text-md font-semibold">
            {'Event media'}
          </p>
          <hr className="border-gray-300 mt-1 mb-3" />
          <div className="space-y-3">
            <InputField
              label="Event Poster Drive ID"
              labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
              value={formValues.eventImage || ""}
              placeholder="Enter Google Drive file ID (e.g., 1mZpgvii35XVK3VnvX49YRO80NeXCaBrD)"
              onChange={(e) => handleInputChange("eventImage", e.target.value)}
              id="eventImage"
              error={errors.eventImage}
            />
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
              <div className="h-51.5 overflow-y-auto border border-gray-400 rounded-2xl p-2 space-y-2">
                {(() => {
                  const visibleOriginalMedia = originalMedia?.filter((media: any) => !deletedMediaIds.includes(media.id)) || [];
                  const hasVisibleMedia = visibleOriginalMedia.length > 0 || newMediaIds.length > 0 || isAddingMedia;

                  return hasVisibleMedia ? (
                    <>
                      {/* Existing media from API (read-only, can delete) */}
                      {visibleOriginalMedia.map((media: any) => {
                        const driveId = media.mediaUrl ? media.mediaUrl.match(/\/d\/([^/?]+)/)?.[1] || media.mediaUrl : '';
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
                    <p className="px-1 h-full text-gray-500 text-[13px] md:text-[14px] flex justify-center lg:text-[15px] items-center">No additional media added.</p>
                  );
                })()}
              </div>
            </div>
        </div>
        <div className="w-full mt-6 lg:mt-0">
          <p className="text-md font-semibold">
            {'Sponsors selection (Optional)'}
          </p>
          <hr className="border-gray-300 mt-1 mb-3" />
          <div className="space-y-3">
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600">
                Event sponsors (if applicable)
              </p>
              <SearchField
                placeholder="Search sponsors..."
                value={companyNameKey || ""}
                onChange={(val) => setCompanyNameKey(val || undefined)}
                className="lg:w-full"
              />
              <div className="h-61 overflow-y-auto border border-gray-400 rounded-2xl p-2">
                {companiesLoading ? (
                  <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">Loading sponsors...</p>
                ) : (
                  <>
                    {companies && companies.length > 0 ? (
                      companies.map((company: Company) => (
                        <div
                          key={company.id}
                          className="p-3 border-b border-gray-300 last:border-b-0 cursor-pointer hover:bg-gray-50 flex items-center"
                        >
                          <Checkbox
                            label=""
                            checked={Array.isArray(formValues.sponsors) && formValues.sponsors.find((sponsor) => sponsor.id === company.id) !== undefined}
                            onChange={() => {
                              setFormValues((prev) => {
                                const currentSponsors = Array.isArray(prev.sponsors) ? prev.sponsors : [];
                                const isSelected = currentSponsors.find((sponsor) => sponsor.id === company.id);
                                const newSponsors = isSelected
                                  ? currentSponsors.filter((sponsor) => sponsor.id !== company.id)
                                  : [...currentSponsors, company];
                                return {
                                  ...prev,
                                  sponsors: newSponsors,
                                };
                              });
                            }}
                          />
                          <div className="flex-1 flex gap-2 items-center">
                            <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-contrast">{company.companyName}</p>
                            <p className="text-sm text-gray-500">{company.businessType}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="px-1 text-gray-500 text-[13px] md:text-[14px] lg:text-[15px]">No sponsors found.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="w-full mt-3">
          <p className="text-md font-semibold mt-6 lg:mt-0">
            {'Slots management (Optional)'}
          </p>
          <hr className="border-gray-300 mt-1 mb-3" />
          <div className="space-y-3">
            <div className="mt-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold mb-1 text-gray-600">
                  Optional slots for attendees to choose from during registration (e.g., talk sessions, job fair slots)
                </p>
                <Button
                  buttonIcon={<FaPlus className="size-3" />}
                  className="py-1 md:py-2 px-3 md:px-4"
                  type="primary"
                  width="fit"
                  onClick={() => setIsAddingSlot(true)}
                />
              </div>
              <div className="h-59 overflow-y-auto border border-gray-400 rounded-2xl p-2 space-y-2">
                {(formValues.slots && formValues.slots.length > 0 || isAddingSlot) ? (
                    <>
                      {/* Existing media from API (read-only, can delete) */}
                      {formValues.slots?.map((slot: EventSlot, index: number) => {
                        return (
                          <div key={index} className="p-2 border border-gray-300 rounded-2xl bg-gray-50">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-gray-700 truncate">{`${format(slot.startTime, "hourFull")} - ${format(slot.endTime, "hourFull")}`}</span>
                              <button
                                onClick={() => handleRemoveSlot(index)}
                                className="text-contrast hover:text-primary cursor-pointer shrink-0"
                                title="Mark for deletion"
                              >
                                <TbTrash className="size-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {isAddingSlot && (
                        <div className="flex items-center gap-2">
                          <Timepicker
                            value={currentSlotInput.startTime}
                            onChange={(val) => setCurrentSlotInput((prev) => ({ ...prev, startTime: val }))}
                          />
                          <Timepicker
                            value={currentSlotInput.endTime}
                            onChange={(val) => setCurrentSlotInput((prev) => ({ ...prev, endTime: val }))}
                          />
                          <Button
                            buttonIcon={<FaCheck className="size-3" />}
                            className="px-2 md:px-3"
                            type="primary"
                            width="fit"
                            onClick={handleAddSlot}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="px-1 h-full text-gray-500 text-[13px] md:text-[14px] flex justify-center lg:text-[15px] items-center">no slots added.</p>
                  )}
              </div>
              {errors.slots && <p className="px-1 text-xs text-primary mt-2">
                {errors.slots}
              </p>}
            </div>
          </div>
        </div>
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
    </Modal>
  );
};

export default AddEditEventModal;
