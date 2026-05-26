# EduNest (Jefferson County Home & School Locator)

EduNest is a beginner-friendly web app that helps you explore homes and nearby schools in Jefferson County, KY using local data files.

## Quickstart (first-time users)

1. Open a terminal.
2. Go to this project folder.
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser.

If it worked, you should see:
- A left sidebar with **Find by School** and **Filter Homes**
- Home result cards in the middle/right area
- A **Closest Schools to Selected Home** panel

## What this app does

- Lets you search for homes near a school name
- Lets you filter homes by bedrooms, bathrooms, and max price
- Shows the 10 closest schools for a selected home
- Provides a **View on Zillow** link for each home card

## Who this is for

- New users who want to run a local web app without backend setup
- Learners exploring HTML/CSS/JavaScript projects
- Anyone who wants a quick local demo of home-school proximity search

## What you need before starting

- Python 3 installed
- A terminal (Command Prompt/PowerShell on Windows, Terminal on macOS/Linux)
- A modern web browser (Chrome, Edge, Firefox, Safari)
- Internet access if you want Zillow links to open externally

## Setup and run (detailed)

### 1) Open a terminal

- **Windows**: Open Command Prompt or PowerShell
- **macOS/Linux**: Open Terminal

### 2) Navigate to the repository root

Replace the path if your local folder is different:

```bash
cd /tmp/workspace/amitaaronsahoo/EduNest
```

### 3) Start the local static server

```bash
python3 -m http.server 8000
```

### 4) Open the app in your browser

Go to:

`http://localhost:8000`

## How to use the app

### 1) Search homes near a school

1. In **Find by School**, type a school name (for example: `DuPont Manual High School`).
2. Click **Search Nearby Homes**.

Expected result:
- The homes list title changes to `Homes Near <School Name>`.
- Homes within about 5 miles are shown, sorted by nearest.

### 2) Filter homes

1. In **Filter Homes**, choose:
   - **Minimum bedrooms**
   - **Minimum bathrooms**
   - **Maximum price** (slider)
2. Click **Apply Filters**.

Expected result:
- The title changes to **Filtered Homes**.
- Only homes matching all selected criteria remain.

### 3) View closest schools for a specific home

1. On any home card, click **Show 10 Closest Schools**.

Expected result:
- The **Closest Schools to Selected Home** panel fills with 10 schools and distance in miles.

### 4) Open the Zillow page

1. On a home card, click **View on Zillow**.

Expected result:
- A Zillow page opens in a new tab.

## Troubleshooting (common first-time issues)

### Problem: You opened `index.html` directly and data does not load

Why: This app fetches local JSON files and must run from a local server.

Fix:
- Close the direct file tab.
- Start the server with `python3 -m http.server 8000`.
- Open `http://localhost:8000`.

### Problem: Port 8000 is already in use

Fix:
- Start on another port:
  ```bash
  python3 -m http.server 8080
  ```
- Then open `http://localhost:8080`.

### Problem: You see “Data unavailable”

Fix:
- Confirm you started the server from the repository root.
- Confirm these files exist:
  - `data/houses.json`
  - `data/Jefferson_County_KY_Schools.geojson`
- Refresh the browser after restarting the server.

### Problem: No homes are shown

Fix:
- School search may not match; try a simpler part of the school name.
- Filters may be too strict; lower bedroom/bathroom minimums and raise max price.

### Quick reset path

1. Clear the **School name** input.
2. Set **Minimum bedrooms** and **Minimum bathrooms** to `Any`.
3. Set **Maximum price** to a high value.
4. Click **Apply Filters**.
5. If needed, restart server and refresh the page.

## Data source and limitations

- Home data comes from `data/houses.json`.
- School data comes from `data/Jefferson_County_KY_Schools.geojson`.
- This app is scoped to Jefferson County data included in this repository.
- Results depend on the quality/completeness of the bundled dataset.
- School search uses partial name matching and returns the first matching school.

## Project structure (quick orientation)

- `/tmp/workspace/amitaaronsahoo/EduNest/index.html` - page layout and UI labels
- `/tmp/workspace/amitaaronsahoo/EduNest/styles.css` - visual styles
- `/tmp/workspace/amitaaronsahoo/EduNest/app.js` - app logic (load data, search, filter, distance)
- `/tmp/workspace/amitaaronsahoo/EduNest/data/houses.json` - homes dataset
- `/tmp/workspace/amitaaronsahoo/EduNest/data/Jefferson_County_KY_Schools.geojson` - schools dataset

## How to report an issue

When reporting a problem, include:

- Exact steps you followed
- What you expected vs what happened
- Browser and version
- Any visible error text (for example: “Data unavailable”)
- Whether you ran the server command from the repository root
