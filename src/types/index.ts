export interface Subject {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  titleAr: string;
  author: string;
  authorAr: string;
  description: string;
  descriptionAr: string;
  subjectId: Subject | string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  totalPages: number;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  _id: string;
  userId: string;
  bookId: Book | string;
  currentPage: number;
  totalPages: number;
  percentComplete: number;
  lastReadAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  _id: string;
  userId: string;
  subjectId: Subject | string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  duration: number;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tasjil {
  _id: string;
  userId: string;
  title: string;
  surah: string;
  ayahRange: string;
  fileUrl: string;
  duration: number;
  uploadedAt: string;
}

export interface Podcast {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  speaker: string;
  fileUrl: string;
  duration: number;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Adhkar {
  _id: string;
  titleAr: string;
  textAr: string;
  transliteration: string;
  translation: string;
  category: string;
  timeOfDay: string;
  repetitions: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collaboration {
  _id: string;
  name: string;
  bookId: Book | string;
  creatorId: string;
  participants: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  targetCompletionDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  messageAr?: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  } & Record<string, any>;
}
