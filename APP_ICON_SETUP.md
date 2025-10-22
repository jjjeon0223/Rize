# App Icon Setup Guide

## 🎨 Your Custom Dark Glass App Icon

I've created a custom app icon that matches your Dark Glass Habit Tracker theme!

### Features:
- Dark glass/gradient background
- Purple accent color (matches your app theme)
- Checkmark symbol (representing habit completion)
- Three dots at top (representing streaks)
- Professional iOS-ready design

---

## 📥 Step 1: Generate the Icon

### Option A: Use the HTML Generator (Easiest)

1. Open `icon-generator.html` in your browser:
   ```bash
   open icon-generator.html
   ```

2. Click the "Download as PNG" button
3. This will download `habit-tracker-icon-1024.png`

### Option B: Screenshot Method

If the download doesn't work:
1. Open `icon-generator.html` in your browser
2. Take a screenshot of just the icon (should be 1024x1024px)
3. Save as PNG

---

## 🔧 Step 2: Generate All iOS Icon Sizes

iOS requires multiple icon sizes. Use one of these methods:

### Method 1: Online Tool (Easiest)

1. Go to [appicon.co](https://www.appicon.co/)
2. Upload your `habit-tracker-icon-1024.png`
3. Select "iPhone" and "iPad"
4. Click "Generate"
5. Download the .zip file

### Method 2: Use Xcode (Manual)

1. Open Xcode
2. In the project navigator, go to: `App` → `App` → `Assets.xcassets` → `AppIcon`
3. Drag and drop your 1024x1024 PNG into the "App Store" slot
4. Xcode will offer to generate all other sizes for you

### Method 3: Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Navigate to your project
cd ~/path/to/Rize

# Create icon sizes
convert habit-tracker-icon-1024.png -resize 20x20 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-20.png
convert habit-tracker-icon-1024.png -resize 40x40 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-20@2x.png
convert habit-tracker-icon-1024.png -resize 60x60 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-20@3x.png
convert habit-tracker-icon-1024.png -resize 29x29 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-29.png
convert habit-tracker-icon-1024.png -resize 58x58 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-29@2x.png
convert habit-tracker-icon-1024.png -resize 87x87 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-29@3x.png
convert habit-tracker-icon-1024.png -resize 40x40 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-40.png
convert habit-tracker-icon-1024.png -resize 80x80 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-40@2x.png
convert habit-tracker-icon-1024.png -resize 120x120 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-40@3x.png
convert habit-tracker-icon-1024.png -resize 120x120 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-60@2x.png
convert habit-tracker-icon-1024.png -resize 180x180 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-60@3x.png
convert habit-tracker-icon-1024.png -resize 76x76 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-76.png
convert habit-tracker-icon-1024.png -resize 152x152 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-76@2x.png
convert habit-tracker-icon-1024.png -resize 167x167 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-83.5@2x.png
convert habit-tracker-icon-1024.png -resize 1024x1024 ios/App/App/Assets.xcassets/AppIcon.appiconset/icon-1024.png
```

---

## 📱 Step 3: Add to Xcode

1. Open your project in Xcode:
   ```bash
   npx cap open ios
   ```

2. In the left sidebar, navigate to:
   `App` → `App` → `Assets.xcassets` → `AppIcon`

3. Drag and drop each icon size into its corresponding slot
   - Or just drag the 1024x1024 icon and let Xcode generate the rest

4. Build and run your app (Cmd+R)

---

## 🎨 Customize the Icon (Optional)

If you want to tweak the design:

1. Open `icon-generator.html` in a text editor
2. Look for these sections to customize:

**Colors:**
```javascript
// Background gradient colors
gradient.addColorStop(0, '#1a1a2e');   // Top color
gradient.addColorStop(0.5, '#16213e'); // Middle color
gradient.addColorStop(1, '#0f1419');   // Bottom color

// Accent color (checkmark and circles)
ctx.strokeStyle = '#8b5cf6';  // Purple - change this!
```

**Checkmark position:**
```javascript
ctx.moveTo(300, 500);  // Start point
ctx.lineTo(450, 650);  // Middle point
ctx.lineTo(720, 350);  // End point
```

3. Save and refresh the browser to see changes
4. Download the new version

---

## 🚀 Done!

Your habit tracker now has a custom dark mode app icon that matches the theme perfectly!

The icon features:
- ✅ Dark glassmorphism design
- ✅ Purple accent matching your app
- ✅ Checkmark for habit completion
- ✅ Streak indicators
- ✅ Professional iOS appearance

Enjoy your new app icon! 🎉
