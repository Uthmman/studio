
'use client'; // May not be strictly necessary but good practice if it uses client-side features implicitly

import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { generateId } from './utils';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 *   * @param pathPrefix The prefix for the storage path (e.g., 'categories', 'features/options').
 * @returns The download URL of the uploaded file, or null if upload fails.
 */
export async function uploadImageToFirebaseStorage(
  file: File,
  pathPrefix: string = 'images'
): Promise<string | null> {
  if (!file) return null;

  const fileExtension = file.name.split('.').pop();
  const randomId = generateId('img');
  const fileName = `${pathPrefix}/${randomId}-${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    // Consider using toast notifications for user feedback here
    return null;
  }
}

/**
 * Deletes an image from Firebase Storage using its download URL.
 * @param imageUrl The download URL of the image to delete.
 * @returns True if deletion was successful or if URL was invalid, false otherwise.
 */
export async function deleteImageFromFirebaseStorage(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
    console.warn('Invalid or non-Firebase Storage URL provided for deletion:', imageUrl);
    return true; // Not a Firebase Storage URL, or empty, so nothing to delete from our storage.
  }

  try {
    const storageRef = ref(storage, imageUrl); // Firebase SDK can parse the URL to get the ref
    await deleteObject(storageRef);
    return true;
  } catch (error: any) {
    // It's common to get 'storage/object-not-found' if the file was already deleted or URL is wrong.
    // We can choose to not treat this as a critical error for the UX.
    if (error.code === 'storage/object-not-found') {
      console.warn('Image not found in Firebase Storage for deletion (might have been already deleted):', imageUrl);
      return true; // Effectively, it's gone.
    }
    console.error("Error deleting image from Firebase Storage:", error);
    return false;
  }
}
