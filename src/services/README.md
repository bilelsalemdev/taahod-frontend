# API Services Documentation

This directory contains all the API service modules for the Al-Hikmah Academy frontend application.

## Overview

All services use Axios for HTTP requests and are configured with:
- Automatic JWT token injection
- Request/response interceptors
- Error handling and retry logic
- TypeScript type safety

## Available Services

### 1. Authentication Service (`authService`)
Handles user authentication and session management.

```typescript
import { authService } from '@/services';

// Login
const response = await authService.login({ email, password });

// Register
const response = await authService.register({ name, email, password });

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### 2. Subject Service (`subjectService`)
Manages Islamic study subjects.

```typescript
import { subjectService } from '@/services';

// Get all subjects
const subjects = await subjectService.getAll();

// Get subject by ID
const subject = await subjectService.getById(id);

// Create subject (admin only)
const newSubject = await subjectService.create(data);

// Update subject (admin only)
await subjectService.update(id, data);

// Delete subject (admin only)
await subjectService.delete(id);

// Get books in subject
const books = await subjectService.getBooks(id);
```

### 3. Book Service (`bookService`)
Manages Islamic books and documents.

```typescript
import { bookService } from '@/services';

// Get all books with pagination
const books = await bookService.getAll({ page: 1, limit: 10 });

// Get book by ID
const book = await bookService.getById(id);

// Upload book (admin only)
const formData = new FormData();
formData.append('file', file);
formData.append('title', title);
const newBook = await bookService.create(formData);

// Get book file URL
const fileUrl = bookService.getFileUrl(bookId);
```

### 4. Progress Service (`progressService`)
Tracks reading progress for books.

```typescript
import { progressService } from '@/services';

// Get all user progress
const progress = await progressService.getAll();

// Get progress for specific book
const bookProgress = await progressService.getByBook(bookId);

// Save/update progress
await progressService.save({
  bookId,
  currentPage: 42,
  totalPages: 200,
  notes: 'Interesting chapter'
});

// Get progress statistics
const stats = await progressService.getStats();
```

### 5. Schedule Service (`scheduleService`)
Manages study schedules.

```typescript
import { scheduleService } from '@/services';

// Get user schedule
const schedule = await scheduleService.get();

// Generate schedule
await scheduleService.generate({
  subjectIds: ['id1', 'id2'],
  dailyStudyHours: 2,
  preferredStartTime: '09:00',
  daysPerWeek: [0, 1, 2, 3, 4] // Sunday to Thursday
});

// Update schedule entry
await scheduleService.update(id, { startTime: '10:00' });

// Delete schedule entry
await scheduleService.delete(id);
```

### 6. Tasjil Service (`tasjilService`)
Manages Quran recitation recordings.

```typescript
import { tasjilService } from '@/services';

// Get all recordings
const recordings = await tasjilService.getAll();

// Upload recording
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('title', title);
formData.append('surah', 'Al-Fatiha');
await tasjilService.upload(formData);

// Get stream URL
const streamUrl = tasjilService.getStreamUrl(recordingId);

// Delete recording
await tasjilService.delete(id);
```

### 7. Podcast Service (`podcastService`)
Manages Islamic educational podcasts.

```typescript
import { podcastService } from '@/services';

// Get all podcasts
const podcasts = await podcastService.getAll();

// Get podcast by ID
const podcast = await podcastService.getById(id);

// Upload podcast (admin only)
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('title', title);
await podcastService.create(formData);

// Get stream URL
const streamUrl = podcastService.getStreamUrl(podcastId);
```

### 8. Adhkar Service (`adhkarService`)
Manages daily adhkar and supplications.

```typescript
import { adhkarService } from '@/services';

// Get all adhkar
const adhkar = await adhkarService.getAll();

// Get adhkar by category
const morningAdhkar = await adhkarService.getByCategory('morning');

// Get specific adhkar
const adhkar = await adhkarService.getById(id);
```

### 9. Collaboration Service (`collaborationService`)
Manages collaborative reading groups.

```typescript
import { collaborationService } from '@/services';

// Get all user collaborations
const collaborations = await collaborationService.getAll();

// Create collaboration
await collaborationService.create({
  name: 'Sahih Bukhari Study Group',
  bookId: 'book123',
  targetCompletionDate: '2024-12-31'
});

// Join collaboration
await collaborationService.join(collaborationId);

// Leave collaboration
await collaborationService.leave(collaborationId);

// Get collaboration progress
const progress = await collaborationService.getProgress(collaborationId);
```

### 10. Profile Service (`profileService`)
Manages user profile and settings.

```typescript
import { profileService } from '@/services';

// Get profile
const profile = await profileService.get();

// Update profile
await profileService.update({
  name: 'New Name',
  language: 'ar',
  currentPassword: 'old',
  newPassword: 'new'
});
```

## Using with React Query

All services can be easily integrated with React Query for better state management:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { bookService } from '@/services';

// Query example
function BookList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => bookService.getAll()
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render books */}</div>;
}

// Mutation example
function BookUpload() {
  const mutation = useMutation({
    mutationFn: (formData: FormData) => bookService.create(formData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });

  const handleSubmit = (formData: FormData) => {
    mutation.mutate(formData);
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## Error Handling

All services use a centralized error handling mechanism:

```typescript
import { getErrorMessage } from '@/utils/errorHandler';

try {
  await bookService.getAll();
} catch (error) {
  const message = getErrorMessage(error, 'ar'); // Get Arabic error message
  console.error(message);
}
```

## Configuration

API base URL is configured via environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Features

- **Automatic Token Management**: JWT tokens are automatically added to requests
- **Retry Logic**: Failed requests are automatically retried (up to 3 times)
- **Error Formatting**: Errors are formatted with both English and Arabic messages
- **Type Safety**: Full TypeScript support with proper types
- **File Upload**: Support for multipart/form-data uploads
- **Streaming**: Audio and document streaming support
