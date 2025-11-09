import { api } from './api';

const CHUNK_SIZE = 512 * 1024; // 512KB chunks (smaller for better reliability)

export interface UploadProgress {
  uploaded: number;
  total: number;
  percentage: number;
}

export interface ChunkedUploadOptions {
  file: File;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (uploadId: string) => void;
  onError?: (error: Error) => void;
}

class ChunkedUploadService {
  /**
   * Upload file in chunks
   */
  async uploadFile(options: ChunkedUploadOptions): Promise<string> {
    const { file, onProgress, onComplete, onError } = options;

    try {
      // Calculate total chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      // Initialize upload
      const { data: initData } = await api.post('/upload/init', {
        filename: file.name,
        totalChunks,
        fileSize: file.size,
        mimeType: file.type,
      });

      const uploadId = initData.data.uploadId;

      // Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', chunkIndex.toString());

        await api.post('/upload/chunk', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 1 minute per chunk
        });

        // Report progress
        if (onProgress) {
          onProgress({
            uploaded: chunkIndex + 1,
            total: totalChunks,
            percentage: Math.round(((chunkIndex + 1) / totalChunks) * 100),
          });
        }
      }

      // Upload complete
      if (onComplete) {
        onComplete(uploadId);
      }

      return uploadId;
    } catch (error: any) {
      if (onError) {
        onError(error);
      }
      throw error;
    }
  }

  /**
   * Get upload progress
   */
  async getProgress(uploadId: string): Promise<UploadProgress> {
    const { data } = await api.get(`/upload/progress/${uploadId}`);
    return data.data.progress;
  }
}

export const chunkedUploadService = new ChunkedUploadService();
