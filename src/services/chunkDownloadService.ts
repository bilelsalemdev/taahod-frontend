import axios from 'axios';

interface DownloadOptions {
  onProgress?: (progress: number) => void;
  chunkSize?: number;
}

/**
 * Download large files in chunks using range requests
 */
export class ChunkDownloadService {
  private static readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB chunks

  /**
   * Download a file in chunks with progress tracking
   */
  static async downloadFile(
    url: string,
    options: DownloadOptions = {}
  ): Promise<Blob> {
    const { onProgress, chunkSize = this.DEFAULT_CHUNK_SIZE } = options;

    try {
      // First, get the file size
      const headResponse = await axios.head(url);
      const fileSize = parseInt(headResponse.headers['content-length'] || '0', 10);
      const contentType = headResponse.headers['content-type'] || 'application/octet-stream';

      if (!fileSize) {
        throw new Error('Unable to determine file size');
      }

      // Download in chunks
      const chunks: ArrayBuffer[] = [];
      let downloadedBytes = 0;

      for (let start = 0; start < fileSize; start += chunkSize) {
        const end = Math.min(start + chunkSize - 1, fileSize - 1);

        const response = await axios.get(url, {
          headers: {
            Range: `bytes=${start}-${end}`,
          },
          responseType: 'arraybuffer',
        });

        chunks.push(response.data);
        downloadedBytes += response.data.byteLength;

        if (onProgress) {
          const progress = Math.round((downloadedBytes / fileSize) * 100);
          onProgress(progress);
        }
      }

      // Combine all chunks into a single blob
      return new Blob(chunks, { type: contentType });
    } catch (error) {
      console.error('Chunk download error:', error);
      throw error;
    }
  }

  /**
   * Download and save file to disk
   */
  static async downloadAndSave(
    url: string,
    filename: string,
    options: DownloadOptions = {}
  ): Promise<void> {
    const blob = await this.downloadFile(url, options);
    
    // Create download link
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(downloadUrl);
  }
}
