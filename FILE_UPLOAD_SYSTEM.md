# Event Modal File Upload System

## Overview

The AddEditEventModal now supports **File uploads** for images while maintaining compatibility with URL strings from the backend. This system separates frontend form handling from backend API payloads.

## Architecture

### Type System

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Form Types                      │
├─────────────────────────────────────────────────────────────┤
│ EventFormValues (internal form state)                       │
│ - eventPoster: File | string                                │
│ - eventPosterPreview?: string (for display)                 │
├─────────────────────────────────────────────────────────────┤
│ EventFormData (output to parent/backend)                    │
│ - eventPoster: File | string                                │
│ - media?: (File | string)[]                                 │
│ - sponsors?: { banner: File | string }[]                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Types                        │
├─────────────────────────────────────────────────────────────┤
│ CreateEventPayload (new events)                             │
│ - eventPoster: File (required)                              │
│ - media?: File[]                                            │
│ - sponsors?: { banner: File }[]                             │
├─────────────────────────────────────────────────────────────┤
│ UpdateEventPayload (existing events)                        │
│ - eventPoster: File | string (File = replace, string = keep)│
│ - media?: (File | string)[]                                 │
│ - sponsors?: { banner: File | string }[]                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Response Type                      │
├─────────────────────────────────────────────────────────────┤
│ Event (from API)                                            │
│ - eventPoster: string (URL)                                 │
│ - media?: string[] (URLs)                                   │
│ - sponsors?: { banner: string (URL) }[]                     │
└─────────────────────────────────────────────────────────────┘
```

## File Locations

```
src/features/events/
├── components/
│   ├── AddEditEventModal.tsx         # Main modal component
│   ├── FileUploadField.tsx           # File upload with drag-and-drop
│   └── EventModalFormFields.tsx      # Reusable form components
├── types/
│   ├── eventModalTypes.ts            # Form internal types
│   └── eventFormTypes.ts             # API payload types + converters
├── constants/
│   └── eventModalConstants.ts        # Validation rules
└── utils/
    └── eventModalUtils.ts            # Validation & conversion functions
```

## Usage Examples

### 1. Using the Modal

```tsx
import { AddEditEventModal } from "@/features/events/components";
import type { EventFormData } from "@/features/events/types/eventFormTypes";

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  const handleSave = (eventFormData: EventFormData) => {
    // eventFormData.eventPoster is either:
    // - File object (new upload) → send to backend
    // - string URL (existing) → no upload needed

    if (eventFormData.eventPoster instanceof File) {
      // User uploaded a new file
      sendToBackend(eventFormData);
    } else {
      // User kept existing URL
      updateBackend(eventFormData);
    }
  };

  return (
    <AddEditEventModal
      event={selectedEvent}
      onClose={() => setIsModalOpen(false)}
      onSave={handleSave}
    />
  );
};
```

### 2. Converting to Backend Payload

```tsx
import {
  convertFormDataToCreatePayload,
  convertFormDataToUpdatePayload,
  convertToMultipartFormData,
} from "@/features/events/types/eventFormTypes";

// For NEW events
const handleCreateEvent = async (formData: EventFormData) => {
  const payload = convertFormDataToCreatePayload(formData);

  if (!payload) {
    alert("Event poster must be uploaded for new events");
    return;
  }

  const multipartData = convertToMultipartFormData(payload);

  await fetch("/api/events", {
    method: "POST",
    body: multipartData, // FormData object
  });
};

// For EDITING events
const handleUpdateEvent = async (formData: EventFormData) => {
  const payload = convertFormDataToUpdatePayload(formData);

  if (!payload) {
    alert("Event ID is required for updates");
    return;
  }

  const multipartData = convertToMultipartFormData(payload);

  await fetch(`/api/events/${payload.id}`, {
    method: "PUT",
    body: multipartData,
  });
};
```

### 3. Backend FormData Structure

When you call `convertToMultipartFormData()`, it creates:

```
FormData {
  title: "Event Title"
  description: "Event description"
  eventType: "Workshop"
  date: "2025-11-18T09:30:00.000Z"
  location: "Building A"
  category: "Workshop"
  capacity: "100"
  registeredCount: "0"
  attendeeCount: "0"

  // New file upload
  eventPoster: File { name: "poster.jpg", size: 123456, type: "image/jpeg" }

  // OR existing URL
  eventPosterUrl: "https://example.com/existing-poster.jpg"

  // Media files
  media: File { name: "image1.jpg" }
  media: File { name: "image2.jpg" }
  mediaUrls[0]: "https://example.com/existing1.jpg"

  // Sponsors
  sponsors[0][companyName]: "TechCorp"
  sponsors[0][banner]: File { name: "sponsor.jpg" }
  sponsors[1][companyName]: "InnovateX"
  sponsors[1][bannerUrl]: "https://example.com/sponsor2.jpg"
}
```

## File Validation

### Client-Side Validation

```tsx
// Automatic validation in modal
- File size: max 5MB
- File types: jpg, jpeg, png, webp, gif
- Required: eventPoster must exist (File or URL)
```

### Validation Functions

```tsx
import {
  validateFile,
  validateEventPoster,
} from "@/features/events/utils/eventModalUtils";

// Validate any image file
const error = validateFile(file);
if (error) {
  console.error(error); // "File size must be less than 5MB"
}

// Validate eventPoster (File or URL)
const posterError = validateEventPoster(posterValue);
if (posterError) {
  console.error(posterError);
}
```

## File Upload Component

The `FileUploadField` component provides:

- ✅ Drag and drop support
- ✅ Click to upload
- ✅ Image preview
- ✅ File size display
- ✅ Clear/remove file
- ✅ Error states
- ✅ Works with both File and URL

```tsx
<FileUploadField
  id="eventPoster"
  label="Event Poster"
  value={formValues.eventPoster} // File | string
  onChange={handleFileChange} // (file: File | null) => void
  preview={formValues.eventPosterPreview} // Optional preview URL
  error={errors.eventPoster}
  accept="image/*"
/>
```

## Data Flow

### Creating New Event

```
1. User clicks "Add Event"
2. Modal opens with empty form
3. User uploads poster → File object created
4. User fills form fields
5. User clicks "Save"
6. validateAllFields() runs
7. convertFormValuesToEventFormData() creates EventFormData
8. Parent receives EventFormData with File
9. Parent converts to CreateEventPayload
10. Parent converts to FormData
11. Parent sends to backend
12. Backend receives File in multipart/form-data
13. Backend uploads to storage, returns URL
14. Backend saves Event with URL string
```

### Editing Existing Event

```
1. User clicks "Edit" on event
2. Modal opens with Event data
3. convertEventToFormValues() converts Event to form state
   - eventPoster: "https://..." (existing URL)
   - eventPosterPreview: "https://..." (for display)
4. User can:
   a) Keep existing image → stays as string URL
   b) Upload new image → becomes File object
5. User clicks "Save"
6. validateAllFields() runs
7. convertFormValuesToEventFormData() creates EventFormData
8. Parent receives EventFormData
   - If eventPoster is File → backend replaces image
   - If eventPoster is string → backend keeps existing
9. Parent converts to UpdateEventPayload
10. Parent converts to FormData
11. Parent sends to backend
12. Backend handles mixed File/string data
```

## Backend Integration Guide

### Expected Backend Behavior

```typescript
// POST /api/events (create)
// Expects: multipart/form-data with File for eventPoster

// PUT /api/events/:id (update)
// Expects: multipart/form-data
//   - If "eventPoster" field (File) → replace image
//   - If "eventPosterUrl" field (string) → keep existing
```

### Backend Example (Node.js/Express)

```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/api/events", upload.single("eventPoster"), async (req, res) => {
  const file = req.file; // File object

  // Upload to S3/Cloudinary/etc
  const imageUrl = await uploadToStorage(file);

  // Save event with URL
  const event = await Event.create({
    ...req.body,
    eventPoster: imageUrl, // Save as string URL
  });

  res.json(event);
});

app.put("/api/events/:id", upload.single("eventPoster"), async (req, res) => {
  const event = await Event.findById(req.params.id);

  let eventPoster = event.eventPoster; // Keep existing

  if (req.file) {
    // New file uploaded → replace
    eventPoster = await uploadToStorage(req.file);
    await deleteFromStorage(event.eventPoster); // Clean up old
  } else if (req.body.eventPosterUrl) {
    // Use existing URL
    eventPoster = req.body.eventPosterUrl;
  }

  event.update({
    ...req.body,
    eventPoster,
  });

  res.json(event);
});
```

## Testing Checklist

- [ ] Create new event with file upload
- [ ] Create new event without file (should show error)
- [ ] Edit event, keep existing poster
- [ ] Edit event, replace poster with new file
- [ ] Drag and drop file upload
- [ ] Click to upload file
- [ ] Clear uploaded file
- [ ] File too large (>5MB) shows error
- [ ] Wrong file type (PDF, etc) shows error
- [ ] Preview displays correctly
- [ ] Form validation works with Files
- [ ] FormData sent to backend correctly

## Benefits of This Architecture

1. **Type Safety**: Full TypeScript support for File and string types
2. **Separation of Concerns**: Form logic separate from API logic
3. **Flexibility**: Handles both new uploads and existing URLs
4. **Validation**: Client-side validation before API call
5. **Testability**: Pure conversion functions can be unit tested
6. **Reusability**: File upload component reusable everywhere
7. **Backend Agnostic**: Works with any multipart/form-data API

## Future Enhancements

- [ ] Multiple file upload for media gallery
- [ ] Sponsor management with file uploads
- [ ] Image cropping/resizing
- [ ] Progress indicators for uploads
- [ ] Retry logic for failed uploads
- [ ] Optimistic UI updates
