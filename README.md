# 🏡 EduNest: Home & School Locator

Welcome to **EduNest**!

This is a simple, easy-to-use web application that helps you find homes and visually explore nearby schools on an interactive map in **Jefferson County, Kentucky**.

---

## 🚀 How to Start the App (For Beginners)

This app runs locally on your computer. You do not need to be a programmer to run it, but you do need one free helper program installed first.

### Step 1: Install Node.js (One-Time Setup)

This app uses a modern system called Vite to load quickly. Vite requires a standard helper tool called Node.js.

1. Go to [nodejs.org](https://nodejs.org/).
2. Download and install the "LTS" (Long Term Support) version for your computer.
3. Click "Next" through the standard installation steps. You do not need to change any default settings.

### Step 2: Open your Terminal

* **Windows:** Click your Start button, type `cmd`, and press **Enter** to open the Command Prompt.
* **Mac:** Press `Cmd + Space`, type `Terminal`, and press **Enter**.

### Step 3: Start the App

Type these commands into your terminal window one by one, pressing **Enter** after each line:

> 💡 **Tip:** Type `cd ` followed by a space, then drag and drop the EduNest folder from your file explorer directly into the terminal to easily paste the path!

cd path/to/EduNest

Download the required setup files (you only have to do this the very first time):

npm install

And then turn on the local website:

npm run dev

Step 4: Open your Browser
After running the last command, the terminal will provide a web address. Open your web browser (Chrome, Edge, Safari, etc.) and type in:

👉 http://localhost:5173

🧭 What you can do in EduNest
🏫 Search by School: Type in the name of a local school (like DuPont Manual High School) to instantly see an interactive map of homes for sale nearby.

🎛️ Filter Homes: Only want a 3-bedroom house under $300k? Use the sliders and dropdowns to filter the results.

🗺️ Explore the Map: Click on the map markers to see the exact locations of properties and nearby educational facilities.

📏 Find the Closest Schools: Select any home card to instantly generate a list of the 10 closest schools to that specific property, including the distance in miles.

🏠 View on Zillow: See a home you love? Click the Zillow button to open the real listing in a new tab.

🛠️ Troubleshooting (Common Issues)
⚠️ Problem: You see an error saying "npm is not recognized"
Why: Your computer doesn't know what Node.js is yet.
Fix: Ensure you completed Step 1 and installed Node.js. You may need to completely close your terminal window and open a new one for the installation to take effect.

⚠️ Problem: You double-clicked index.html and the screen is blank
Why: Modern web apps cannot be opened directly from your file explorer. They must be served through a local server to access data files securely.
Fix: Close that browser tab, open your terminal, and follow the Quick Start instructions to run npm run dev.

⚠️ Problem: No homes are showing up on the map
Fix 1: You might have a typo in the school search box. Try typing a simpler part of the name.
Fix 2: Your filters might be too strict. Try changing the bedrooms and bathrooms back to "Any" and increasing the maximum price.

📁 For the Curious: How the files are organized
If you want to poke around the files, here is a simple map of where things live:

src/components/ - The visual puzzle pieces of the website (Buttons, Navigation, Home Cards).

src/core/ - The heavy lifting (like MapService.js which draws the map).

public/data/ - Where the spreadsheets live (houses.json and the school data).

index.html - The front door to the application.
