# Firebase Storage CORS Configuration

## Prerequisites

Before deploying CORS, ensure you have:

- Firebase CLI installed: `npm install -g firebase-tools`
- Authenticated with Firebase: `firebase login`
- Your project initialized: `firebase init`

## CORS Configuration File

The CORS configuration is defined in `cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "PUT", "POST", "HEAD", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

This configuration:

- Allows requests from all origins (`*`)
- Supports all required HTTP methods for file uploads/downloads
- Sets cache duration to 1 hour (3600 seconds)

## Deployment Instructions

### Using Firebase CLI (Recommended)

Run the following command in your project root directory:

```bash
firebase storage:upload-cors cors.json
```

### Using gsutil (Alternative)

If you have Google Cloud SDK installed:

```bash
gsutil cors set cors.json gs://keysystem-d0b86-8df89.firebasestorage.app
```

Replace `keysystem-d0b86-8df89.firebasestorage.app` with your actual Firebase Storage bucket name.

## Verify CORS Configuration

To verify that CORS has been properly configured:

```bash
firebase storage:download-cors
```

Or with gsutil:

```bash
gsutil cors get gs://keysystem-d0b86-8df89.firebasestorage.app
```

## Storage Rules Deployment

Update your Storage Rules using the Firebase Console or Firebase CLI:

```bash
firebase deploy --only storage
```

The rules are defined in `firebase-storage.rules` and enforce:

- Users can only access their own files in `users/{userId}/*`
- All requests must be authenticated
- Exact path matching prevents unauthorized access

## Troubleshooting

If uploads still fail after CORS deployment:

1. **Clear browser cache** and try again
2. **Check Firebase Console** > Storage > Rules tab for any syntax errors
3. **Verify your userId** is correctly passed from the authentication context
4. **Check browser DevTools** > Network tab for detailed error responses
5. **Ensure you are authenticated** before attempting uploads

## Testing

Once configured, your application should:
✅ Upload files successfully
✅ Download files directly from storage
✅ Share files with proper permissions
✅ Manage file metadata in Firestore
