# DGX Radar 2025

An interactive React application that visualizes digital skills and technologies in a radar diagram format, designed for government digital transformation initiatives. This enhanced version includes comprehensive tooltips, visual indicators for new items, non-overlapping blips, and a data view/download feature.

## Features

### Visualization Enhancements
- Interactive radar diagram with distinct, non-overlapping annular rings
- Color-coded rings with a gradient from red (innermost) to blue-grey (outermost):
  - Innermost ring ('0-6m'): Red (#ff3333)
  - Second ring ('6-12m'): Lighter red (#ff6666)
  - Third ring ('1-2y'): Light blue-grey (#9999cc)
  - Outermost ring ('3y+'): Passive blue-grey (#7a7a9e)
- Collision detection algorithm to prevent overlapping blips for better usability
- Quadrant labels with clear bounding boxes and improved visibility
- Responsive design that works on various screen sizes

### Data Display
- Comprehensive tooltips showing item details on hover:
  - Name, quadrant, ring
  - Theme and proximity (if available)
  - Description with Markdown formatting
  - Status indicators
- Detailed modal window when clicking on items
- Visual indicators for new items:
  - Yellow border (2px vs 1px for regular items)
  - Star symbol (★) above new items
  - "New" badge in both tooltip and modal window
- Support for status field with orange background

### Data Management
- Fetches data from a published Google Sheets document
- "View Raw Data" feature accessible from the footer:
  - Displays all data in a nicely formatted table
  - Proper column headers (including "isNew" field)
  - Download button for JSON data export
- Fallback to sample data if the Google Sheets data cannot be loaded

### Development & Deployment
- Automated deployment script for GitHub and Vercel
- Vercel configuration for seamless deployment
- Comprehensive documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/harl00/dgx-radar-2025.git
   cd dgx-radar-2025
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Data Structure

The application expects the Google Sheets data to have the following columns:

- **quadrant**: The quadrant of the radar visualization (e.g., "legacy", "resiliency", "culture", "platforms")
- **ring**: The concentric ring (e.g., "0-6m", "6-12m", "1-2y", "3y+")
- **name**: The name of the item
- **description**: Markdown-formatted description that appears on hover and in the detail view
- **isNew**: Set to 'TRUE' to mark an item as new (will display with special indicators)
- **theme** (optional): Theme or category the item belongs to
- **proximity** (optional): Proximity or relevance indicator
- **status** (optional): Status information for the item

Additional custom fields can be added and will be displayed in both the tooltip and detail view.

## Google Sheets Integration

### Sample Data Fallback

The application includes a sample data fallback mechanism. If the Google Sheets data cannot be loaded (due to URL issues, CORS restrictions, or other problems), the application will automatically use the sample data defined in `src/data/sampleData.js`.

### Configuring a Working Google Sheets URL

To use your own Google Sheets data:

1. Create a Google Sheet with the required columns (quadrant, ring, name, description)
2. Make the sheet public by going to File > Share > Publish to web
3. Select the appropriate sheet and publish it
4. Update the URL in `src/services/DataService.js`:

```javascript
// For a real application, you would use a different approach:
// 1. Use the Google Sheets API with an API key
// 2. Export the sheet as CSV and host it on your server
// 3. Use a proxy server to avoid CORS issues

this.url = 'YOUR_GOOGLE_SHEETS_PUBLIC_URL';
```

### Alternative Approaches

For a production application, consider these more robust approaches:

1. **Google Sheets API**: Use the official API with authentication
2. **CSV Export**: Export the sheet as CSV and host it on your server
3. **Backend Proxy**: Create a simple backend service to fetch and serve the data

## Building for Production

To create a production build:

```
npm run build
```

This will create a `build` directory with optimized production files.

## Recent Enhancements

The following enhancements have been implemented in this version:

1. **Tooltip Improvements**
   - Added comprehensive information display on hover
   - Styled to match the modal window's appearance
   - Added support for Markdown formatting in descriptions

2. **Ring Visualization**
   - Changed the order of rings to create a logical progression
   - Implemented annular rings (donut shapes) to prevent color overlapping
   - Added semi-transparent fill (20% opacity) for better visual distinction

3. **New Item Indicators**
   - Added yellow stroke around new items
   - Implemented star symbol above new items
   - Added "New" badge in tooltip and modal window
   - Updated code to check for 'TRUE' string value for isNew flag

4. **Data Visualization**
   - Removed cardinal direction indicators (N/S/E/W) for cleaner appearance
   - Implemented collision detection to prevent overlapping blips
   - Enhanced quadrant labels with better styling and positioning

5. **Raw Data Access**
   - Added "View Raw Data" link in the footer
   - Created modal window for data display with proper formatting
   - Implemented JSON download functionality

## Deployment

### Automated Deployment

This project includes a deployment script (`deploy.sh`) that automates the process of deploying to GitHub and Vercel:

1. Make the script executable:
   ```
   chmod +x deploy.sh
   ```

2. Run the script:
   ```
   ./deploy.sh
   ```

3. The script will:
   - Initialize a git repository if needed
   - Add and commit your files
   - Check if the GitHub repository exists
   - Create the repository if it doesn't exist
   - Push your code to GitHub
   - Deploy to Vercel if the CLI is installed

### Manual Deployment to Vercel

If you prefer to deploy manually to Vercel:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

### Vercel Configuration

The `vercel.json` file contains the configuration for Vercel deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This configuration ensures that:
- The React application is built correctly
- Static assets are served properly
- Client-side routing works as expected
- All routes are directed to the main application

### Environment Variables

No environment variables are required for basic functionality. The application uses a fallback to sample data if the Google Sheets data cannot be loaded.

## Project Structure

The project is organized as follows:

```
dgx-radar-2025/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── DataModal.js     # Raw data display modal
│   │   ├── DetailView.js    # Item detail modal
│   │   ├── Header.js        # Application header
│   │   ├── LoadingSpinner.js # Loading indicator
│   │   └── RadarChart.js    # Main radar visualization
│   ├── data/                # Data sources
│   │   └── sampleData.js    # Fallback sample data
│   ├── services/            # Service modules
│   │   └── DataService.js   # Data fetching service
│   ├── App.js               # Main application component
│   ├── App.css              # Application styles
│   └── index.js             # Application entry point
├── deploy.sh                # Deployment script
├── vercel.json              # Vercel configuration
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Technologies Used

- **React**: Frontend framework for building the user interface
- **D3.js**: Visualization library for creating the radar chart
- **Styled Components**: CSS-in-JS library for component styling
- **Axios**: HTTP client for fetching data from Google Sheets
- **Marked**: Library for parsing Markdown content in descriptions
- **Blob API**: For generating downloadable data files
- **GitHub CLI/API**: For repository creation and management
- **Vercel**: For hosting and deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
