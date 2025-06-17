import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media print {
    width: 100%;
    height: 100%;
    page-break-inside: avoid;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const SVGContainer = styled.svg`
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
`;

const RadarPrintChart = ({ data, rings, quadrants }) => {
  const svgRef = useRef(null);

  // Helper function to get color for ring - gradient from red to blue-grey
  const getColorForRing = (ring) => {
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
        color = '#999999'; // Default gray
    }
    return color;
  };

  // Function to get text color for ring (for contrast)
  const getRingTextColor = () => {
    // All rings have white text for better contrast
    return '#ffffff';
  };

  // Draw the radar chart
  useEffect(() => {
    if (!data || data.length === 0 || !rings || !quadrants) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 * 0.88;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create a group for the radar chart
    const chart = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw the rings
    const ringScale = d3.scaleLinear()
      .domain([0, rings.length])
      .range([0, radius]);
      
    // Store ring label data to add after quadrant lines
    const ringLabelData = [];

    // Draw rings as annular rings (rings with holes) to prevent overlapping
    rings.forEach((ring, i) => {
      // Get color for the ring
      const ringColor = getColorForRing(ring);
      
      // Create annular ring (donut shape) instead of a full circle
      // For the first ring (innermost), we don't need a hole
      const innerRadius = i === 0 ? 0 : ringScale(i);
      const outerRadius = ringScale(i + 1);
      
      // Create a donut shape using an arc path
      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);
      
      chart.append('path')
        .attr('d', arc)
        .attr('fill', ringColor)
        .attr('fill-opacity', 0.2)
        .attr('stroke', ringColor)
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.7);
      
      // Store ring label data to add after quadrant lines (so they appear in front)
      const labelY = -ringScale(i + 1) - 10;
      ringLabelData.push({
        ring,
        ringColor,
        labelY
      });
    });

    // Draw the quadrant lines and cardinal direction indicators
    const angleStep = (2 * Math.PI) / quadrants.length;
    
    // First pass: calculate maximum dimensions needed for any quadrant label
    const lineHeight = 20;
    const padding = 15;
    let maxBoxWidth = 0;
    let maxBoxHeight = 0;
    const quadrantLabelData = [];
    
    // Process all quadrant labels to determine max dimensions and store data for rendering
    quadrants.forEach((quadrant, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      
      // Convert quadrant name to CamelCase
      const camelCaseQuadrant = quadrant.charAt(0).toUpperCase() + quadrant.slice(1);
      
      // Handle text wrapping for long quadrant names
      const maxLineLength = 15; // Maximum characters per line
      let lines = [];
      let words = camelCaseQuadrant.split(' ');
      let currentLine = words[0];
      
      // Create wrapped text lines
      for (let j = 1; j < words.length; j++) {
        if (currentLine.length + words[j].length + 1 <= maxLineLength) {
          currentLine += ' ' + words[j];
        } else {
          lines.push(currentLine);
          currentLine = words[j];
        }
      }
      lines.push(currentLine); // Add the last line
      
      // Calculate box dimensions for this label
      const thisBoxWidth = Math.max(...lines.map(line => line.length * 8)) + padding * 2;
      const thisBoxHeight = lines.length * lineHeight + padding * 1.5;
      
      // Update maximum dimensions if needed
      maxBoxWidth = Math.max(maxBoxWidth, thisBoxWidth);
      maxBoxHeight = Math.max(maxBoxHeight, thisBoxHeight);
      
      // Store data for this quadrant label
      quadrantLabelData.push({
        angle,
        lines,
        quadrant
      });
    });
    
    // Add 10% padding to max dimensions to ensure all text fits comfortably
    maxBoxWidth = Math.ceil(maxBoxWidth * 1.1);
    maxBoxHeight = Math.ceil(maxBoxHeight * 1.1);
    
    // Second pass: draw quadrant lines and labels with consistent box sizes
    quadrantLabelData.forEach(({ angle, lines, quadrant }, i) => {
      // Draw quadrant line with increased prominence
      chart.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos(angle))
        .attr('y2', radius * Math.sin(angle))
        .attr('stroke', '#666') // Darker color for better visibility
        .attr('stroke-width', 2.5) // Increased width
        .attr('stroke-opacity', 0.8); // Slightly transparent
        
      // Add subtle quadrant background to further distinguish quadrants
      const quadrantArc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
        .startAngle(angle)
        .endAngle(angle + angleStep);
        
      chart.append('path')
        .attr('d', quadrantArc)
        .attr('fill', i % 2 === 0 ? '#f8f8f8' : '#f0f0f0') // Alternate subtle background colors
        .attr('fill-opacity', 0.4)
        .attr('stroke', 'none')
        .lower(); // Push to back so it doesn't overlap other elements
      
      // Calculate label position - exact same distance from radar edge for all labels
      const labelRadius = radius * 1.3; // Increased consistent distance from radar edge
      const labelX = labelRadius * Math.cos(angle + angleStep / 2);
      const labelY = labelRadius * Math.sin(angle + angleStep / 2);
      
      // Add label background box with consistent size
      chart.append('rect')
        .attr('x', labelX - maxBoxWidth / 2)
        .attr('y', labelY - maxBoxHeight / 2)
        .attr('width', maxBoxWidth)
        .attr('height', maxBoxHeight)
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('fill', 'white')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 2);
      
      // Add multi-line quadrant label text
      lines.forEach((line, lineIndex) => {
        const yOffset = (lineIndex - (lines.length - 1) / 2) * lineHeight;
        chart.append('text')
          .attr('x', labelX)
          .attr('y', labelY + yOffset)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('fill', '#333')
          .text(line);
      });
    });
    
    // Add ring labels with increased size and prominence
    ringLabelData.forEach(({ ring, ringColor, labelY }) => {
      // Add background box for ring label
      const labelWidth = ring.length * 14; // Approximate width based on text length
      const labelHeight = 28; // Fixed height for all labels
      
      // Add label background box
      chart.append('rect')
        .attr('x', -labelWidth / 2)
        .attr('y', labelY - labelHeight / 2)
        .attr('width', labelWidth)
        .attr('height', labelHeight)
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('fill', 'white')
        .attr('stroke', ringColor)
        .attr('stroke-width', 1.5)
        .attr('fill-opacity', 0.9);
      
      // Add ring label text on top of background
      chart.append('text')
        .attr('x', 0)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '18px')
        .attr('fill', ringColor)
        .attr('font-weight', 'bold')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', '0.7px')
        .text(ring);
    });

    // Store all blip positions to avoid overlaps
    const blipPositions = [];
    const minDistance = 15; // Minimum distance between blips
    
    // Function to check if a position is too close to existing blips
    const isTooClose = (x, y) => {
      return blipPositions.some(pos => {
        const dx = pos.x - x;
        const dy = pos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
    };
    
    // Function to check if a position is too close to quadrant lines
    const isTooCloseToQuadrantLines = (x, y) => {
      // Check distance to each quadrant line
      return quadrants.some((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        
        // Calculate the distance from point (x,y) to the line from origin at angle
        // For a line from origin with angle θ, the distance is |x*sin(θ) - y*cos(θ)|
        const distance = Math.abs(x * Math.sin(angle) - y * Math.cos(angle));
        
        // Minimum safe distance from quadrant lines (blip radius + buffer)
        const safeDistance = 8; // 5 (blip radius) + 3 (buffer)
        
        return distance < safeDistance;
      });
    };
    
    // Function to check if a position is too close to timeline labels
    const isTooCloseToLabels = (x, y) => {
      // Check for each ring label (positioned at the top of each ring)
      return rings.some((ring, i) => {
        // Label position is at (0, -ringScale(i + 1) - 10)
        const labelX = 0;
        const labelY = -ringScale(i + 1) - 10;
        
        // Calculate distance to label
        const dx = labelX - x;
        const dy = labelY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create a larger exclusion zone around labels
        const exclusionRadius = 40 + (i * 5); // Increasing exclusion zone for outer rings
        
        return distance < exclusionRadius;
      });
    };
    
    // Function to find a valid position for a blip
    const findValidPosition = (quadrantIndex, ringIndex) => {
      // Try up to 100 times to find a non-overlapping position that's not near labels
      for (let attempt = 0; attempt < 100; attempt++) {
        let angle;
        const isTopQuadrant = (quadrantIndex === 0 || quadrantIndex === (quadrants.length - 1));
        
        if (isTopQuadrant) {
          // For top quadrants, avoid the very top area (where labels are)
          const minOffset = Math.PI / 6; // 30 degrees
          
          // Generate angle within the quadrant but avoiding the top
          const baseAngle = quadrantIndex * angleStep - Math.PI / 2;
          const angleRange = angleStep - minOffset;
          
          if (Math.random() < 0.5) {
            // Left side of the avoidance zone
            angle = baseAngle + (angleRange * Math.random());
          } else {
            // Right side of the avoidance zone
            angle = baseAngle + minOffset + (angleRange * Math.random());
          }
        } else {
          // For other quadrants, use the normal angle calculation
          const angleVariance = angleStep * 0.8;
          angle = quadrantIndex * angleStep - Math.PI / 2 + (angleStep / 2) + (angleVariance * (Math.random() - 0.5));
        }
        
        // Calculate distance with some randomness within the ring
        const ringStart = ringIndex;
        // Position within the ring (30% to 70%)
        const normalizedPos = 0.3 + 0.4 * Math.random();
        const distance = ringScale(ringStart + normalizedPos);
        
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);
        
        // If this position is not too close to any existing blip, label, or quadrant line, use it
        if (!isTooClose(x, y) && !isTooCloseToLabels(x, y) && !isTooCloseToQuadrantLines(x, y)) {
          blipPositions.push({ x, y });
          return { x, y };
        }
      }
      
      // If we couldn't find a non-overlapping position, try one more time with a position that at least avoids the labels
      for (let attempt = 0; attempt < 50; attempt++) {
        let angle;
        const isTopQuadrant = (quadrantIndex === 0 || quadrantIndex === (quadrants.length - 1));
        
        if (isTopQuadrant) {
          const baseAngle = quadrantIndex * angleStep - Math.PI / 2;
          const minOffset = Math.PI / 6; // 30 degrees away from top
          const angleRange = angleStep - minOffset;
          
          if (Math.random() < 0.5) {
            angle = baseAngle + (angleRange * Math.random());
          } else {
            angle = baseAngle + minOffset + (angleRange * Math.random());
          }
        } else {
          const angleVariance = angleStep * 0.8;
          angle = quadrantIndex * angleStep - Math.PI / 2 + (angleStep / 2) + (angleVariance * (Math.random() - 0.5));
        }
        
        const ringStart = ringIndex;
        const normalizedPos = 0.3 + 0.4 * Math.random();
        const distance = ringScale(ringStart + normalizedPos);
        
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);
        
        // Only check if it's not too close to labels and quadrant lines
        if (!isTooCloseToLabels(x, y) && !isTooCloseToQuadrantLines(x, y)) {
          blipPositions.push({ x, y });
          return { x, y };
        }
      }
      
      // Last resort: use a position in the bottom half of the chart
      const angle = Math.PI / 2 + (Math.random() - 0.5); // Around the bottom
      const distance = ringScale(ringIndex + 0.3 + 0.4 * Math.random());
      
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      
      blipPositions.push({ x, y });
      return { x, y };
    };
    
    // Plot the items
    data.forEach(item => {
      const quadrantIndex = quadrants.indexOf(item.quadrant);
      const ringIndex = rings.indexOf(item.ring);
      
      if (quadrantIndex === -1 || ringIndex === -1) return;
      
      // Find a valid position for this blip
      const { x, y } = findValidPosition(quadrantIndex, ringIndex);
      
      // Add item dot
      chart.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', getColorForRing(item.ring))
        .attr('stroke', item.isNew === 'TRUE' ? '#ffcc00' : '#fff') // Yellow stroke for new items
        .attr('stroke-width', item.isNew === 'TRUE' ? 2 : 1); // Thicker stroke for new items
      
      // Add a star marker for new items
      if (item.isNew === 'TRUE') {
        chart.append('text')
          .attr('x', x)
          .attr('y', y - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', '#ffcc00')
          .attr('font-weight', 'bold')
          .text('★'); // Star symbol for new items
      }
    });

  }, [data, rings, quadrants, getColorForRing, getRingTextColor]);

  return (
    <ChartContainer>
      <SVGContainer ref={svgRef}></SVGContainer>
    </ChartContainer>
  );
};

export default RadarPrintChart;
