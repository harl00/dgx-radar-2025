import React from 'react';
import styled from 'styled-components';
import { marked } from 'marked';

const DetailContainer = styled.div`
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

const DetailPanel = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 30px;
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

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
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

const DetailHeader = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
`;

const DetailTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
`;

const DetailMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
`;

const MetaItem = styled.div`
  background-color: ${props => props.$bgColor || '#f5f5f5'};
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: ${props => props.$textColor || '#666'};
  font-weight: ${props => props.$isRing ? 'bold' : 'normal'};
`;

const DetailContent = styled.div`
  line-height: 1.6;
  color: #444;

  p {
    margin-bottom: 15px;
  }

  a {
    color: #0066cc;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  ul, ol {
    margin-bottom: 15px;
    padding-left: 20px;
  }
  
  li {
    margin: 0.1em 0; /* Reduce space between list items */
  }
  
  pre, code {
    background-color: #f5f5f5;
    border-radius: 3px;
    padding: 0.2em 0.4em;
    margin-bottom: 15px;
    white-space: pre-wrap;
  }
  
  blockquote {
    border-left: 3px solid #ddd;
    margin-left: 0;
    padding-left: 1em;
    color: #666;
    margin-bottom: 15px;
  }
  
  /* Ensure proper handling of line breaks */
  white-space: pre-line;
`;

const DetailView = ({ item, onClose }) => {
  // Function to get color for ring - gradient from red to blue-grey
  const getRingColor = (ring) => {
    console.log('DetailView - Getting color for ring:', ring);
    let color;
    switch(ring) {
      case '0-6m': // Closest to center
        color = '#ff3333'; // Red
        break;
      case '6-12m': // Second ring
        color = '#ff6666'; // Lighter red
        break;
      case '1-2y': // Third ring
        color = '#9999cc'; // Light blue-grey
        break;
      case '3y+': // Furthest ring
        color = '#7a7a9e'; // Passive blue-grey
        break;
      default:
        color = '#f5f5f5'; // Default gray
    }
    console.log('DetailView - Color for ring', ring, ':', color);
    return color;
  };
  
  // Function to get text color for ring (for contrast)
  const getRingTextColor = (ring) => {
    // All rings now have white text for better contrast
    return '#ffffff';
  };

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

  if (!item) return null;
  
  return (
    <DetailContainer onClick={handleBackgroundClick}>
      <DetailPanel>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        
        <DetailHeader>
          <DetailTitle>{item.name}</DetailTitle>
          <DetailMeta>
            <MetaItem>Quadrant: {item.quadrant.charAt(0).toUpperCase() + item.quadrant.slice(1)}</MetaItem>
            <MetaItem 
              $bgColor={getRingColor(item.ring)} 
              $textColor={getRingTextColor(item.ring)}
              $isRing={true}
            >
              Ring: {item.ring}
            </MetaItem>
            {item.emergent === 'TRUE' && (
              <MetaItem
                $bgColor="#ffcc00" 
                $textColor="#333"
                $isRing={false}
              >
                Emergent
              </MetaItem>
            )}
            {item.status && (
              <MetaItem 
                $bgColor="#ff9900" 
                $textColor="#fff"
                $isRing={false}
              >
                {item.status}
              </MetaItem>
            )}
          </DetailMeta>
        </DetailHeader>
        
        <DetailContent>
          {item.description && (
            <div dangerouslySetInnerHTML={{ 
              __html: (() => {
                // Process the description to ensure newlines are preserved
                // First, replace any literal \n with actual newlines
                let processedDescription = item.description.replace(/\\n/g, '\n');
                
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
              })()
            }} />
          )}
          
          {/* Display any additional metadata */}
          {Object.entries(item).map(([key, value]) => {
            // Skip already displayed fields, emergent flag, and status
            if (['name', 'quadrant', 'ring', 'description', 'emergent', 'status'].includes(key)) {
              return null;
            }
            
            return (
              <div key={key}>
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p>{value}</p>
              </div>
            );
          })}
        </DetailContent>
      </DetailPanel>
    </DetailContainer>
  );
};

export default DetailView;
