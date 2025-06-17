import React from 'react';
import styled from 'styled-components';
import { marked } from 'marked';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const ModalContent = styled.div`
  padding: 20px 30px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
`;

const ModalFooter = styled.div`
  padding: 15px 30px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
`;

const DownloadButton = styled.a`
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableHeader = styled.th`
  background-color: #f5f5f5;
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
  
  /* Styling for markdown content */
  p {
    margin: 0.5em 0;
  }
  
  ul, ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }
  
  pre, code {
    background-color: #f5f5f5;
    border-radius: 3px;
    padding: 0.2em 0.4em;
  }
  
  blockquote {
    border-left: 3px solid #ddd;
    margin-left: 0;
    padding-left: 1em;
    color: #666;
  }
  
  /* Handle multi-line content */
  white-space: pre-line;
  max-height: 200px;
  overflow-y: auto;
`;

const NewBadge = styled.span`
  background-color: #ffcc00;
  color: #333;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
`;

const DataModal = ({ data, onClose }) => {
  // Get all unique keys from the data
  const allKeys = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      allKeys.add(key);
    });
  });
  
  // Convert to array and sort
  const headers = Array.from(allKeys).sort((a, b) => {
    // Put name, quadrant, ring, description at the beginning
    const priority = { name: 1, quadrant: 2, ring: 3, description: 4 };
    const aPriority = priority[a] || 100;
    const bPriority = priority[b] || 100;
    return aPriority - bPriority;
  });
  
  // Create a JSON string for download
  const jsonData = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([jsonData], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(dataBlob);
  
  // Handle click on the background to close
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle escape key to close
  React.useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);
  
  return (
    <ModalOverlay onClick={handleBackgroundClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Raw Data</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <DataTable>
            <thead>
              <tr>
                {headers.map(header => (
                  <TableHeader key={header}>
                    {header === 'isNew' ? 'isNew' : header.charAt(0).toUpperCase() + header.slice(1)}
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {headers.map(header => (
                    <TableCell key={`${index}-${header}`}>
                      {header === 'name' && item.isNew === 'TRUE' ? (
                        <>
                          {item[header]}
                          <NewBadge>New</NewBadge>
                        </>
                      ) : header === 'description' ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: item[header] ? (() => {
                            // Process the description to ensure newlines are preserved
                            // First, replace any literal \n with actual newlines
                            let processedDescription = item[header].replace(/\\n/g, '\n');
                            
                            // Process markdown list items (lines starting with *)
                            // We need to ensure that lines starting with * are properly processed as list items
                            // This regex looks for newlines followed by * and preserves them for markdown processing
                            processedDescription = processedDescription.replace(/\n\s*\*\s+/g, '\n* ');
                            
                            // Then replace any double newlines with a special marker (but not before list items)
                            processedDescription = processedDescription.replace(/\n\n(?!\*)/g, '<br><br>');
                            
                            // Replace single newlines with a line break (but not before list items)
                            processedDescription = processedDescription.replace(/\n(?!\*)/g, '<br>');
                            
                            // Convert markdown to HTML
                            let htmlContent = marked(processedDescription, { breaks: true, gfm: true });
                            
                            // Add target="_blank" to all links
                            htmlContent = htmlContent.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"(?:\s+[^>]*)?>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">');
                            
                            return htmlContent;
                          })() : '' 
                        }} />
                      ) : header === 'isNew' ? (
                        item[header] === 'TRUE' ? 'TRUE' : 'FALSE'
                      ) : (
                        item[header] || ''
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        </ModalContent>
        
        <ModalFooter>
          <DownloadButton 
            href={downloadUrl} 
            download="radar-data.json"
            target="_self" // Ensure internal links don't open in a new window
          >
            Download JSON
          </DownloadButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DataModal;
