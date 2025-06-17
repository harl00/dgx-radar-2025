import axios from 'axios';

class DataService {
  constructor() {
    // Use the direct CSV export URL provided by the user
    this.csvUrl = 'https://docs.google.com/spreadsheets/d/1JB87mB7J_VZbCaicjL1V4mbRChk0ziK8vDW7uwAcM5U/export?format=csv';
    
    // Keep the original HTML URL as a fallback
    this.originalUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQc5KhlSfWhu-NP1deWWJ43UGGleIyf-XLv0GsNA2Nelm1T2ljTcsc4LJ2627pcOOhnZBrCXh2M3rx/pubhtml';
    
    // We'll try multiple approaches to fetch the data
    this.data = [];
  }

  async fetchData() {
    try {
      // Try multiple approaches to fetch the data
      let data = null;
      let error = null;
      
      // Approach 1: Try CSV format directly
      try {
        console.log('Trying CSV format directly...');
        const response = await axios.get(this.csvUrl);
        const csvData = response.data;
        data = this.parseCSV(csvData);
        console.log('Successfully fetched and parsed CSV data');
      } catch (err) {
        console.error('Error using CSV format:', err);
        error = err;
        
        // Approach 2: Try CSV format with allOrigins proxy
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(this.csvUrl)}`;
          console.log('Trying CSV with allOrigins proxy...');
          const response = await axios.get(proxyUrl);
          const csvData = response.data;
          data = this.parseCSV(csvData);
          console.log('Successfully fetched and parsed CSV data using allOrigins proxy');
        } catch (err2) {
          console.error('Error using CSV with allOrigins proxy:', err2);
          error = err2;
          
          // Approach 3: Try HTML format with allOrigins proxy
          try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(this.originalUrl)}`;
            console.log('Trying HTML with allOrigins proxy...');
            const response = await axios.get(proxyUrl);
            const htmlData = response.data;
            data = this.parseHTML(htmlData);
            console.log('Successfully fetched and parsed HTML data using allOrigins proxy');
          } catch (err3) {
            console.error('Error using HTML with allOrigins proxy:', err3);
            error = err3;
            
            // Approach 4: Try HTML format with cors-anywhere proxy
            try {
              const proxyUrl = `https://cors-anywhere.herokuapp.com/${this.originalUrl}`;
              console.log('Trying HTML with cors-anywhere proxy...');
              const response = await axios.get(proxyUrl);
              const htmlData = response.data;
              data = this.parseHTML(htmlData);
              console.log('Successfully fetched and parsed HTML data using cors-anywhere proxy');
            } catch (err4) {
              console.error('Error using HTML with cors-anywhere proxy:', err4);
              error = err4;
              
              // Approach 5: Try direct access (might work in some environments)
              try {
                console.log('Trying direct HTML access...');
                const response = await axios.get(this.originalUrl);
                const htmlData = response.data;
                data = this.parseHTML(htmlData);
                console.log('Successfully fetched and parsed HTML data using direct access');
              } catch (err5) {
                console.error('Error using direct HTML access:', err5);
                error = err5;
              }
            }
          }
        }
      }
      
      // If all approaches failed, throw the last error
      if (!data || data.length === 0) {
        throw error || new Error('Failed to fetch data from Google Sheets');
      }
      
      console.log('Parsed data:', data);
      
      this.data = data;
      return data;
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
      throw error;
    }
  }

  // Get unique quadrants
  getQuadrants() {
    return [...new Set(this.data.map(item => item.quadrant))].filter(Boolean);
  }

  // Get unique rings
  getRings() {
    return [...new Set(this.data.map(item => item.ring))].filter(Boolean);
  }

  // Get items for a specific quadrant and ring
  getItems(quadrant, ring) {
    return this.data.filter(item => 
      item.quadrant === quadrant && 
      item.ring === ring
    );
  }

  // Get all items
  getAllItems() {
    return this.data;
  }
  
  // Parse CSV data
  parseCSV(csvData) {
    // First, we need to handle the CSV properly, including multi-line cells
    // We'll use a more robust approach to parse the CSV
    
    // Process the CSV data to handle multi-line content within cells
    const processedCsv = this.preprocessCsv(csvData);
    
    // Split the processed CSV data into lines
    const lines = processedCsv.split('\n');
    if (lines.length <= 1) {
      throw new Error('Not enough rows found in the CSV data');
    }
    
    // Parse the header row (first line)
    const headerLine = lines[0];
    const headers = this.parseCSVLine(headerLine).map(header => 
      header.toLowerCase()
    );
    
    // Check if we have the required headers
    const requiredHeaders = ['quadrant', 'ring', 'name', 'description'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      console.warn(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Parse the data rows
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      // Split the line into values, handling quoted values that might contain commas
      const values = this.parseCSVLine(lines[i]);
      
      if (values.length < headers.length) continue; // Skip incomplete rows
      
      const item = {};
      headers.forEach((header, index) => {
        if (index < values.length) {
          item[header] = values[index];
        }
      });
      
      // Only add items that have a name
      if (item.name && item.name.length > 0) {
        data.push(item);
      }
    }
    
    return data;
  }
  
  // Preprocess CSV to handle multi-line content within quoted cells
  preprocessCsv(csvData) {
    // This is a completely different approach that doesn't try to parse the CSV line by line
    // Instead, we'll use a regex-based approach to handle the CSV parsing
    
    // First, normalize line endings
    const normalizedCsv = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // We'll use a special marker that's unlikely to appear in the data
    const NEWLINE_MARKER = '___NEWLINE_MARKER___';
    
    // Replace all newlines within quotes with our marker
    // This regex finds all quoted fields and replaces newlines within them
    const processedCsv = normalizedCsv.replace(/"([^"]|"")*"/g, (match) => {
      // Replace all newlines in this quoted field with our marker
      return match.replace(/\n/g, NEWLINE_MARKER);
    });
    
    // Now we can safely split by real newlines
    const lines = processedCsv.split('\n');
    
    // Process each line to restore our newlines
    const processedLines = lines.map(line => {
      return line.replace(new RegExp(NEWLINE_MARKER, 'g'), '\n');
    });
    
    return processedLines.join('\n');
  }
  
  // Helper function to parse a CSV line, handling quoted values and preserving newlines
  parseCSVLine(line) {
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // When we hit a comma outside of quotes, we've reached the end of a value
        values.push(this.cleanCsvValue(currentValue));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(this.cleanCsvValue(currentValue));
    
    return values;
  }
  
  // Helper function to clean CSV values (trim and remove enclosing quotes if present)
  cleanCsvValue(value) {
    value = value.trim();
    // Remove enclosing quotes if present, but preserve internal quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      // Remove the first and last quote
      value = value.substring(1, value.length - 1);
      // Replace double quotes with single quotes (CSV escapes quotes by doubling them)
      value = value.replace(/""/g, '"');
    }
    return value;
  }
  
  // Parse HTML data
  parseHTML(htmlData) {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlData;
    
    // Find the table in the HTML - Google Sheets typically has multiple tables
    const tables = tempDiv.querySelectorAll('table');
    if (tables.length === 0) {
      throw new Error('No tables found in the Google Sheet');
    }
    
    // Google Sheets usually has the data in the second table
    // The first table is often just the sheet name
    const table = tables.length > 1 ? tables[1] : tables[0];
    const rows = table.querySelectorAll('tr');
    
    if (rows.length <= 1) {
      throw new Error('Not enough rows found in the Google Sheet');
    }
    
    // Extract headers (assuming first row contains headers)
    const headers = [];
    const headerCells = rows[0].querySelectorAll('td');
    headerCells.forEach(cell => {
      headers.push(cell.textContent.trim().toLowerCase());
    });
    
    // Check if we have the required headers
    const requiredHeaders = ['quadrant', 'ring', 'name', 'description'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      console.warn(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Extract data from remaining rows
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.querySelectorAll('td');
      
      // Skip empty rows
      if (cells.length === 0 || cells.length < headers.length) continue;
      
      const item = {};
      cells.forEach((cell, index) => {
        if (index < headers.length) {
          // Get the text content and preserve line breaks
          let content = cell.textContent.trim();
          
          // Replace any HTML line breaks with actual newlines
          // This ensures that multi-line content is properly preserved
          content = content.replace(/\s*<br\s*\/?>\s*/gi, '\n');
          
          item[headers[index]] = content;
        }
      });
      
      // Only add items that have a name
      if (item.name && item.name.length > 0) {
        data.push(item);
      }
    }
    
    return data;
  }
}

const dataService = new DataService();
export default dataService;
