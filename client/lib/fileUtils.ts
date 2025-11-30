import {
  ref,
  uploadBytes,
  deleteObject,
  getBytes,
  listAll,
} from "firebase/storage";
import { storage, db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export interface FileMetadata {
  id: string;
  userId: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  shareToken?: string;
  shareExpiry?: string;
  isShared: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB per file

export const uploadFile = async (
  userId: string,
  file: File
): Promise<FileMetadata> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds maximum limit of 5GB");
  }

  const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const storagePath = `users/${userId}/files/${fileId}`;
  const storageRef = ref(storage, storagePath);

  try {
    await uploadBytes(storageRef, file, {
      customMetadata: {
        originalName: file.name,
      },
    });

    const fileDoc = await addDoc(
      collection(db, "users", userId, "files"),
      {
        fileId: fileId,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        isShared: false,
        storagePath: storagePath,
      }
    );

    return {
      id: fileDoc.id,
      userId: userId,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      isShared: false,
    };
  } catch (error) {
    throw error;
  }
};

export const listUserFiles = async (userId: string): Promise<FileMetadata[]> => {
  try {
    const filesRef = collection(db, "users", userId, "files");
    const q = query(filesRef);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      userId: userId,
      ...doc.data(),
    } as FileMetadata));
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (
  userId: string,
  fileId: string,
  storagePath: string
): Promise<void> => {
  try {
    // Delete from storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    const fileDocRef = doc(db, "users", userId, "files", fileId);
    await deleteDoc(fileDocRef);
  } catch (error) {
    throw error;
  }
};

export const downloadFile = async (
  userId: string,
  storagePath: string,
  fileName: string
): Promise<void> => {
  try {
    const storageRef = ref(storage, storagePath);
    const fileBytes = await getBytes(storageRef);
    const blob = new Blob([fileBytes]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};

export const createShareLink = async (
  userId: string,
  fileId: string,
  expiryHours: number
): Promise<{ token: string; url: string }> => {
  try {
    const expiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    const shareToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const fileDocRef = doc(db, "users", userId, "files", fileId);
    await updateDoc(fileDocRef, {
      isShared: true,
      shareToken: shareToken,
      shareExpiry: expiry.toISOString(),
    });

    return {
      token: shareToken,
      url: `${window.location.origin}/share/${shareToken}`,
    };
  } catch (error) {
    throw error;
  }
};

export const getSharedFile = async (
  shareToken: string
): Promise<{
  file: FileMetadata;
  userId: string;
} | null> => {
  try {
    // Query all users' files for the share token (would need security rules)
    // For now, this is a simplified implementation
    // In production, this should be handled by a backend endpoint with proper security
    return null;
  } catch (error) {
    throw error;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
