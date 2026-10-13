import { CLOUDINARY_CONFIG, type CloudinaryUploadResponse } from '../config/cloudinary';
import type { MediaAsset } from '../types';

export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<MediaAsset> {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  if (!isImage && !isVideo && !isPdf) {
    throw new Error('Unsupported file type. Please upload an image, video, or PDF.');
  }

  // Max sizes: image 10MB, video 60MB, pdf 20MB
  const maxBytes = isVideo ? 60 * 1024 * 1024 : 20 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File is too large. Maximum size is ${isVideo ? '60MB' : '20MB'}.`);
  }

  const resourceType = isVideo ? 'video' : isPdf ? 'raw' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    xhr.open('POST', url, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          const asset: MediaAsset = {
            id: res.public_id,
            publicId: res.public_id,
            secureUrl: res.secure_url,
            resourceType: res.resource_type,
            format: res.format,
            width: res.width,
            height: res.height,
            bytes: res.bytes,
            originalFilename: file.name,
            createdAt: new Date().toISOString(),
          };
          resolve(asset);
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}. Check upload preset configuration.`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during media upload. Check your internet connection.'));
    };

    xhr.send(formData);
  });
}
