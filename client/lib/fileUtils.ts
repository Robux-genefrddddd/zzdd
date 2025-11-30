import {
  ref,
  uploadBytes,
  deleteObject,
  getBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage, db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
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
  storagePath?: string;
  fileId?: string;
  downloadUrl?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB per file

export const uploadFile = async (
  userId: string,
  file: File,
): Promise<FileMetadata> => {
  // Auth check - CRITICAL
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  // Validate userId format (Firebase UIDs are non-empty strings)
  if (typeof userId !== "string" || userId.length === 0) {
    throw new Error("Invalid user authentication state");
  }

  // File validation
  if (!file) {
    throw new Error("No file selected");
  }

  if (file.size === 0) {
    throw new Error("File is empty");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds maximum limit of 5GB");
  }

  try {
    // Correct storage path: users/{userId}/{timestamp}_{filename}
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const storagePath = `users/${userId}/${timestamp}_${sanitizedFileName}`;
    const fileRef = ref(storage, storagePath);

    console.log(`[Upload] Starting upload for user ${userId}: ${storagePath}`);

    // Upload file to Firebase Storage
    const uploadResult = await uploadBytes(fileRef, file, {
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        userId: userId,
      },
    });

    console.log(
      "[Upload] File uploaded successfully:",
      uploadResult.ref.fullPath,
    );

    // Get download URL
    let downloadUrl = "";
    try {
      downloadUrl = await getDownloadURL(fileRef);
      console.log("[Upload] Download URL obtained");
    } catch (urlError) {
      console.warn(
        "[Upload] Warning: Could not get download URL immediately",
        urlError,
      );
      downloadUrl = `gs://${uploadResult.ref.bucket}/${storagePath}`;
    }

    // Save metadata to Firestore
    const fileDoc = await addDoc(collection(db, "users", userId, "files"), {
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
      storagePath: storagePath,
      downloadUrl: downloadUrl,
      isShared: false,
      shareToken: null,
      shareExpiry: null,
    });

    console.log("[Upload] Metadata saved to Firestore:", fileDoc.id);

    // Update storage used in user document
    await updateUserStorageUsed(userId);

    return {
      id: fileDoc.id,
      userId: userId,
      name: file.name,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
      isShared: false,
      storagePath: storagePath,
      fileId: fileDoc.id,
      downloadUrl: downloadUrl,
    };
  } catch (error: any) {
    console.error("[Upload] Error during file upload:", error);

    // Detailed error messages for troubleshooting
    if (error.code === "storage/unauthorized") {
      throw new Error(
        "Upload permission denied. Check Storage Rules, authentication, and CORS configuration.",
      );
    } else if (error.code === "storage/retry-limit-exceeded") {
      throw new Error(
        "Upload timeout. Please check your connection and try again.",
      );
    } else if (error.code === "storage/invalid-argument") {
      throw new Error("Invalid file or path. Please try a different file.");
    } else if (error.code === "storage/object-not-found") {
      throw new Error(
        "Storage location not found. Configuration issue detected.",
      );
    } else if (error.code === "storage/bucket-not-found") {
      throw new Error("Storage bucket not accessible. Check Firebase config.");
    } else if (
      error.message?.includes("Network") ||
      error.message?.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network error during upload. Ensure CORS is configured and connection is active.",
      );
    } else if (error.message?.includes("403")) {
      throw new Error(
        "Access forbidden. Verify Storage Rules allow authenticated uploads.",
      );
    }

    throw new Error(
      `Upload failed: ${error.message || "Unknown error occurred"}`,
    );
  }
};

export const listUserFiles = async (
  userId: string,
): Promise<FileMetadata[]> => {
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  try {
    const filesRef = collection(db, "users", userId, "files");
    const snapshot = await getDocs(query(filesRef));

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: userId,
        name: data.fileName || "Unknown",
        size: data.fileSize || 0,
        mimeType: data.fileMimeType || "application/octet-stream",
        uploadedAt: data.uploadedAt || new Date().toISOString(),
        isShared: data.isShared || false,
        shareToken: data.shareToken,
        shareExpiry: data.shareExpiry,
        storagePath: data.storagePath,
        downloadUrl: data.downloadUrl,
        fileId: doc.id,
      };
    });
  } catch (error: any) {
    console.error("[ListFiles] Error:", error);
    throw new Error(`Failed to load files: ${error.message}`);
  }
};

export const deleteFile = async (
  userId: string,
  fileId: string,
  storagePath: string,
): Promise<void> => {
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  try {
    // Delete from Storage
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
    console.log("[Delete] File deleted from Storage:", storagePath);

    // Delete from Firestore
    await deleteDoc(doc(db, "users", userId, "files", fileId));
    console.log("[Delete] Metadata deleted from Firestore:", fileId);

    // Recalculate storage used
    await updateUserStorageUsed(userId);
  } catch (error: any) {
    console.error("[Delete] Error:", error);
    if (error.code === "storage/object-not-found") {
      // File already deleted from storage, just remove metadata
      await deleteDoc(doc(db, "users", userId, "files", fileId));
      // Recalculate storage used
      await updateUserStorageUsed(userId);
      return;
    }
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

export const downloadFile = async (
  userId: string,
  storagePath: string,
  fileName: string,
): Promise<void> => {
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  try {
    const fileRef = ref(storage, storagePath);
    const fileBytes = await getBytes(fileRef);
    const blob = new Blob([fileBytes]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("[Download] File downloaded:", fileName);
  } catch (error: any) {
    console.error("[Download] Error:", error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

export const createShareLink = async (
  userId: string,
  fileId: string,
  expiryHours: number,
): Promise<{ token: string; url: string }> => {
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  try {
    const expiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    const shareToken =
      Math.random().toString(36).substring(2, 15) +
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
  } catch (error: any) {
    console.error("[ShareLink] Error:", error);
    throw new Error(`Failed to create share link: ${error.message}`);
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
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export const calculateStorageUsed = async (userId: string): Promise<number> => {
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  try {
    const filesRef = collection(db, "users", userId, "files");
    const snapshot = await getDocs(query(filesRef));

    let totalSize = 0;
    snapshot.docs.forEach((doc) => {
      const fileSize = doc.data().fileSize || 0;
      totalSize += fileSize;
    });

    return totalSize;
  } catch (error: any) {
    console.error("[CalculateStorageUsed] Error:", error);
    return 0;
  }
};

export const updateUserStorageUsed = async (userId: string): Promise<void> => {
  if (!userId || userId.trim() === "") {
    throw new Error("User not authenticated");
  }

  try {
    const storageUsed = await calculateStorageUsed(userId);
    await updateDoc(doc(db, "users", userId), {
      storageUsed: storageUsed,
    });
    console.log("[UpdateStorageUsed] Updated storage used:", storageUsed);
  } catch (error: any) {
    console.error("[UpdateStorageUsed] Error:", error);
  }
};
