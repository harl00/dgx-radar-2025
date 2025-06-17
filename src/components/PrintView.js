import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import RadarPrintChart from './RadarPrintChart';
import '../PrintStyles.css';

const PrintContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  font-family: Arial, sans-serif;
  color: #333;

  @media print {
    padding: 0;
    max-width: 100%;
  }
`;

const PrintHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 28px;
`;

const Subtitle = styled.h2`
  margin: 0 0 20px 0;
  color: #7f8c8d;
  font-size: 18px;
  font-weight: normal;
`;

const Introduction = styled.div`
  margin-bottom: 30px;
  line-height: 1.6;
  
  p {
    margin-bottom: 15px;
  }
  
  ul, ol {
    margin-bottom: 15px;
    padding-left: 20px;
  }
`;

const ChartContainer = styled.div`
  margin: 30px auto;
  page-break-inside: avoid;
  height: 600px;
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media print {
    margin: 20px auto;
    height: 500px;
  }
`;

const QuadrantSection = styled.div`
  margin: 40px 0;
  page-break-inside: avoid;
`;

const QuadrantTitle = styled.h2`
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
  color: #2c3e50;
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ItemCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const ItemHeader = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
`;

const RingBadge = styled.span`
  background-color: ${props => props.$bgColor || '#f5f5f5'};
  color: ${props => props.$textColor || '#666'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const ItemContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  
  p {
    margin-bottom: 10px;
  }
  
  ul, ol {
    margin-bottom: 10px;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 5px;
  }
  
  pre, code {
    background-color: #f5f5f5;
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-family: monospace;
    font-size: 12px;
  }
  
  blockquote {
    border-left: 3px solid #ddd;
    margin-left: 0;
    padding-left: 10px;
    color: #666;
  }
`;

const PrintButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background-color: #2980b9;
  }
  
  @media print {
    display: none;
  }
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #7f8c8d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  
  &:hover {
    background-color: #6c7a7d;
  }
  
  @media print {
    display: none;
  }
`;

const PrintView = ({ data, rings, quadrants, title, subtitle, introduction, onBack }) => {
  const [introHtml, setIntroHtml] = useState('');
  
  useEffect(() => {
    // Convert introduction markdown to HTML
    if (introduction) {
      setIntroHtml(marked(introduction, { breaks: true, gfm: true }));
    }
  }, [introduction]);
  
  // Function to get color for ring
  const getRingColor = (ring) => {
    let color;
    switch(ring) {
      case '0-6m':
        color = '#ff3333'; // Red
        break;
      case '6-12m':
        color = '#ff6666'; // Lighter red
        break;
      case '1-2y':
        color = '#9999cc'; // Light blue-grey
        break;
      case '3y+':
        color = '#7a7a9e'; // Passive blue-grey
        break;
      default:
        color = '#999999'; // Default gray
    }
    return color;
  };
  
  // Function to get text color for ring (for contrast)
  const getRingTextColor = () => {
    return '#ffffff'; // White text for all rings
  };
  
  // Handle print button click
  const handlePrint = () => {
    window.print();
  };
  
  // Group items by quadrant
  const itemsByQuadrant = {};
  quadrants.forEach(quadrant => {
    itemsByQuadrant[quadrant] = data.filter(item => item.quadrant === quadrant);
  });
  
  return (
    <>
      <PrintButton onClick={handlePrint}>Print / Save as PDF</PrintButton>
      <BackButton onClick={onBack}>← Back to Radar</BackButton>
      
      <PrintContainer>
        <PrintHeader>
          <Title>{title || 'Technology Radar'}</Title>
          <Subtitle>{subtitle || 'Interactive visualization of technology trends'}</Subtitle>
        </PrintHeader>
        
        {introduction && (
          <Introduction dangerouslySetInnerHTML={{ __html: introHtml }} />
        )}
        
        <ChartContainer>
          <RadarPrintChart 
            data={data} 
            rings={rings} 
            quadrants={quadrants} 
          />
        </ChartContainer>
        
        {quadrants.map(quadrant => (
          <QuadrantSection key={quadrant}>
            <QuadrantTitle>
              {quadrant.charAt(0).toUpperCase() + quadrant.slice(1)}
            </QuadrantTitle>
            
            <ItemsContainer>
              {itemsByQuadrant[quadrant].map((item, index) => {
                // Process description to convert markdown to HTML
                let descriptionHtml = '';
                if (item.description) {
                  // Process the description to ensure newlines are preserved
                  let processedDescription = item.description.replace(/\\n/g, '\n');
                  processedDescription = processedDescription.replace(/\n\s*\*\s+/g, '\n* ');
                  
                  // Convert markdown to HTML
                  descriptionHtml = marked(processedDescription, { breaks: true, gfm: true });
                }
                
                return (
                  <ItemCard key={index}>
                    <ItemHeader>
                      <ItemTitle>{item.name}</ItemTitle>
                      <RingBadge 
                        $bgColor={getRingColor(item.ring)} 
                        $textColor={getRingTextColor()}
                      >
                        {item.ring}
                      </RingBadge>
                    </ItemHeader>
                    
                    <ItemContent dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                  </ItemCard>
                );
              })}
            </ItemsContainer>
          </QuadrantSection>
        ))}
      </PrintContainer>
    </>
  );
};

export default PrintView;
