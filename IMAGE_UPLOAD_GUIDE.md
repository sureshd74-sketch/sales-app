# Product Image Upload Guide 📸

## How to Upload Product Images

### For Admin Users:

1. **Login as Admin**
2. Go to **Product Catalog**
3. Click **"Add Product"** or **"Edit"** on existing product
4. Fill in product details
5. **Scroll to "Product Image" section**
6. Click **"Choose File"** or tap the file input
7. Select an image from your device (JPG, PNG)
8. **Image preview will appear** - you can see how it looks
9. Click **"Remove Image"** if you want to change it
10. Click **"Save Product"**
11. Image uploads automatically! ✅

### Image Requirements:
- **Format:** JPG, PNG, GIF, WebP
- **Max Size:** 2MB per image
- **Recommended:** 400x400px or larger (square images work best)
- **Auto-resized:** Images are automatically optimized

### Features:
- ✅ **Image Preview** - See image before saving
- ✅ **Remove Option** - Remove image if needed
- ✅ **Edit Images** - Update product images anytime
- ✅ **Display in Catalog** - Images show in product list
- ✅ **Placeholder** - Shows 📦 icon if no image

### Tips:
- Use clear, well-lit product photos
- Square images (1:1 ratio) look best
- Keep file sizes under 2MB for faster uploads
- You can add images later by editing products

### Troubleshooting:

**"Image size must be less than 2MB"**
- Compress your image using online tools
- Or resize the image before uploading

**"Please select an image file"**
- Make sure you're selecting a valid image file
- Supported: JPG, PNG, GIF, WebP

**Image not showing after upload**
- Check your internet connection
- Refresh the page
- Check browser console (F12) for errors

**"Storage not initialized"**
- Make sure Firebase Storage is enabled (see FIREBASE_SETUP_GUIDE.md)
- Check Firebase config in firebase-config.js

---

## Firebase Storage Setup

If you haven't set up Firebase Storage yet:

1. Go to Firebase Console
2. Click **"Storage"** in left menu
3. Click **"Get started"**
4. Select **"Start in test mode"**
5. Choose location (same as Firestore)
6. Click **"Done"**
7. Update Storage rules (see FIREBASE_SETUP_GUIDE.md)

**That's it!** Your product images will be stored securely in Firebase Storage. 🎉


