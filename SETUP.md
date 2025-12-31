# Xeltrix Sales App - Setup Instructions

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" or select an existing project
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Start in **test mode** for development (you'll update security rules later)
   - Choose a location closest to your users

3. **Get Firebase Configuration**
   - Go to Project Settings (gear icon) > General
   - Scroll down to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Register your app with a nickname
   - Copy the `firebaseConfig` object

4. **Update firebase-config.js**
   - Open `firebase-config.js`
   - Replace the placeholder values with your actual Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id"
     };
     ```

5. **Set Up Firestore Security Rules**
   - Go to Firestore Database > Rules
   - Update the rules to allow read access to all, but write access only for products (admin):
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         // Products: everyone can read, only admin can write
         match /products/{productId} {
           allow read: if true;
           allow write: if false; // Admin writes handled via admin password
         }
         // Sales: everyone can read their own, admin can read all
         match /sales/{saleId} {
           allow read: if true;
           allow create: if true;
         }
         // Visits: everyone can read their own, admin can read all
         match /visits/{visitId} {
           allow read: if true;
           allow create: if true;
         }
       }
     }
     ```
   - Click "Publish"

## Admin Password

The default admin password is set in `script.js`:
```javascript
const ADMIN_PASSWORD = 'admin123';
```

**IMPORTANT:** Change this password in production! Edit the `ADMIN_PASSWORD` constant in `script.js`.

## Deploy the App

### Option 1: Firebase Hosting (Recommended)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy --only hosting`

### Option 2: Any Web Host
- Upload all files to your web server
- Ensure HTTPS is enabled (required for PWA)
- Access via your domain

### Option 3: Local Development
- Use a local server (Python: `python -m http.server`, Node: `npx http-server`)
- Note: Service Worker requires HTTPS (or localhost)

## Testing

1. **Test Salesperson Login**
   - Select a salesperson from the dropdown
   - Should see home screen with options

2. **Test Admin Login**
   - Select "Admin" from dropdown
   - Enter admin password
   - Should see Admin Dashboard option

3. **Test Product Catalog**
   - As admin: Add/edit products
   - As salesperson: View products (read-only)

4. **Test Sales Entry**
   - Fill out sales form
   - Verify data saves to Firestore

5. **Test Visit Entry**
   - Fill out visit form
   - Verify data saves to Firestore

6. **Test PWA Installation**
   - On mobile: Open in browser
   - Look for "Add to Home Screen" prompt
   - Or use browser menu > "Add to Home Screen"

## Troubleshooting

- **Firebase not loading**: Check that Firebase SDK scripts are loaded before firebase-config.js
- **Service Worker not registering**: Ensure app is served over HTTPS (or localhost)
- **Offline not working**: Check browser console for service worker errors
- **Data not saving**: Check Firestore security rules and browser console for errors

## Customization

- **Salesperson Names**: Edit the `<option>` values in `index.html` (loginScreen section)
- **Admin Password**: Change `ADMIN_PASSWORD` in `script.js`
- **Logo**: Replace `xeltrix-logo.png` with your logo (recommended: 512x512px)
- **Colors**: Edit CSS variables in `style.css` (`:root` section)


