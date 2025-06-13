# DGX Radar 2025

An interactive React application that visualizes digital skills and technologies in a radar diagram format, designed for government digital transformation initiatives.

## Features

- Fetches data from a published Google Sheets document
- Visualizes data in an interactive radar diagram with distinct, non-overlapping rings
- Color-coded rings with a gradient from red (innermost) to blue-grey (outermost)
- Displays comprehensive item details on hover (name, quadrant, ring, theme, proximity, description)
- Highlights new items with visual indicators (yellow border, star symbol, "New" badge)
- Shows detailed information in a modal window when clicking on items
- Supports Markdown formatting in descriptions
- Includes a "View Raw Data" feature to see and download the complete dataset
- Implements collision detection to prevent overlapping blips for better usability
- Responsive design that works on various screen sizes
- Fallback to sample data if the Google Sheets data cannot be loaded

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

## Deployment

### Deploying to Vercel

This project is configured for easy deployment to Vercel:

1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Login to Vercel:
   ```
   vercel login
   ```
4. Deploy the project:
   ```
   vercel
   ```
5. For production deployment:
   ```
   vercel --prod
   ```

### Environment Variables

No environment variables are required for basic functionality. The application uses a fallback to sample data if the Google Sheets data cannot be loaded.

## Technologies Used

- React
- D3.js for visualization
- Styled Components for styling
- Axios for HTTP requests
- Marked for parsing Markdown content
- Blob API for data downloads

## License

This project is licensed under the MIT License - see the LICENSE file for details.
