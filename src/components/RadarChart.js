import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { marked } from 'marked';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-width: 350px;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
`;

// Note: We're using inline styles for the tooltip content instead of styled components

const RadarChart = ({ data, rings, quadrants, onItemClick }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Helper function to get color for ring - gradient from red to blue-grey
  const getColorForRing = useCallback((ring) => {
    console.log('Getting color for ring:', ring);
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
    console.log('Color for ring', ring, ':', color);
    return color;
  }, []);

  // Function to get text color for ring (for contrast)
  const getRingTextColor = useCallback((ring) => {
    // All rings now have white text for better contrast
    return '#ffffff';
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      setDimensions({ width, height });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw the radar chart
  useEffect(() => {
    if (!data || data.length === 0 || !rings || !quadrants || dimensions.width === 0) return;

    // Debug: Log the data to see if isNew flag is present
    console.log('RadarChart data:', data);
    console.log('Items with isNew flag:', data.filter(item => item.isNew));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2 * 0.8;
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

      // Add ring labels
      chart.append('text')
        .attr('x', 0)
        .attr('y', -ringScale(i + 1) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', ringColor)
        .attr('font-weight', 'bold')
        .text(ring);
    });

    // Draw the quadrant lines and cardinal direction indicators
    const angleStep = (2 * Math.PI) / quadrants.length;
    
    // No cardinal direction indicators (N/S/E/W) as requested
    
    // Draw quadrant lines and labels
    quadrants.forEach((quadrant, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      
      // Draw quadrant line
      chart.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos(angle))
        .attr('y2', radius * Math.sin(angle))
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3'); // Make the lines dashed for better visual distinction
      
      // Convert quadrant name to CamelCase
      const camelCaseQuadrant = quadrant.charAt(0).toUpperCase() + quadrant.slice(1);
      
      // Calculate label position - move further from the edge
      const labelRadius = radius * 1.25; // Increased from 1.1 to 1.25
      const labelX = labelRadius * Math.cos(angle + angleStep / 2);
      const labelY = labelRadius * Math.sin(angle + angleStep / 2);
      
      // Add label background box - larger and more prominent
      const padding = 15; // Increased from 10 to 15
      const boxWidth = camelCaseQuadrant.length * 12 + padding * 2; // Increased text size multiplier
      const boxHeight = 40; // Increased from 30 to 40
      
      chart.append('rect')
        .attr('x', labelX - boxWidth / 2)
        .attr('y', labelY - boxHeight / 2)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 8) // Increased rounded corners
        .attr('ry', 8)
        .attr('fill', 'white')
        .attr('stroke', '#ccc') // Darker border
        .attr('stroke-width', 2) // Thicker border
        .attr('filter', 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))'); // Add subtle shadow
      
      // Add quadrant label - larger text
      chart.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '16px') // Increased from 14px to 16px
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(camelCaseQuadrant);
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
    
    // Function to find a valid position for a blip
    const findValidPosition = (quadrantIndex, ringIndex) => {
      // Try up to 50 times to find a non-overlapping position
      for (let attempt = 0; attempt < 50; attempt++) {
        // Calculate position with some randomness
        const angleVariance = angleStep * 0.8; // Use 80% of the quadrant angle for variance
        const angle = quadrantIndex * angleStep - Math.PI / 2 + (angleStep / 2) + (angleVariance * (Math.random() - 0.5));
        
        // Calculate distance with some randomness within the ring
        const ringStart = ringIndex;
        // Position within the ring (30% to 70%)
        const normalizedPos = 0.3 + 0.4 * Math.random();
        const distance = ringScale(ringStart + normalizedPos);
        
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);
        
        // If this position is not too close to any existing blip, use it
        if (!isTooClose(x, y)) {
          blipPositions.push({ x, y });
          return { x, y };
        }
      }
      
      // If we couldn't find a non-overlapping position after 50 attempts,
      // use the last attempted position and slightly adjust it
      const angle = quadrantIndex * angleStep - Math.PI / 2 + (angleStep / 2) * Math.random();
      const distance = ringScale(ringIndex + 0.3 + 0.4 * Math.random());
      
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      
      // Add a small offset to reduce the chance of exact overlap
      const offset = minDistance * 0.5;
      const offsetX = x + offset * (Math.random() - 0.5);
      const offsetY = y + offset * (Math.random() - 0.5);
      
      blipPositions.push({ x: offsetX, y: offsetY });
      return { x: offsetX, y: offsetY };
    };
    
    // Plot the items
    data.forEach(item => {
      const quadrantIndex = quadrants.indexOf(item.quadrant);
      const ringIndex = rings.indexOf(item.ring);
      
      if (quadrantIndex === -1 || ringIndex === -1) return;
      
      // Find a valid position for this blip
      const { x, y } = findValidPosition(quadrantIndex, ringIndex);
      
      // Add item dot
      const dot = chart.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', getColorForRing(item.ring))
        .attr('stroke', item.isNew === 'TRUE' ? '#ffcc00' : '#fff') // Yellow stroke for new items
        .attr('stroke-width', item.isNew === 'TRUE' ? 2 : 1) // Thicker stroke for new items
        .attr('cursor', 'pointer')
        .attr('data-name', item.name)
        .attr('data-description', item.description || '')
        .attr('data-quadrant', item.quadrant)
        .attr('data-ring', item.ring);
      
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
      
      // Add hover effect
      dot.on('mouseover', function(event) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8);
        
        const tooltip = d3.select(tooltipRef.current);
        
        // Create tooltip content with styled components
        const ringColor = getColorForRing(item.ring);
        const ringTextColor = getRingTextColor(item.ring);
        
        // Build metadata items HTML
        let metaItemsHtml = `
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            <div style="background-color: #f5f5f5; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #666;">
              Quadrant: ${item.quadrant.charAt(0).toUpperCase() + item.quadrant.slice(1)}
            </div>
            <div style="background-color: ${ringColor}; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: ${ringTextColor}; font-weight: bold;">
              Ring: ${item.ring}
            </div>
        `;
        
        // Add theme if available
        if (item.theme) {
          metaItemsHtml += `
            <div style="background-color: #f5f5f5; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #666;">
              Theme: ${item.theme}
            </div>
          `;
        }
        
        // Add proximity if available
        if (item.proximity) {
          metaItemsHtml += `
            <div style="background-color: #f5f5f5; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #666;">
              Proximity: ${item.proximity}
            </div>
          `;
        }
        
        // Add "New" badge if item is new
        if (item.isNew === 'TRUE') {
          metaItemsHtml += `
            <div style="background-color: #ffcc00; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #333; font-weight: bold;">
              New
            </div>
          `;
        }
        
        // Add status if available
        if (item.status) {
          metaItemsHtml += `
            <div style="background-color: #ff9900; padding: 3px 8px; border-radius: 4px; font-size: 12px; color: #fff; font-weight: bold;">
              ${item.status}
            </div>
          `;
        }
        
        metaItemsHtml += `</div>`;
        
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY + 10}px`)
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333;">
              ${item.name}
            </div>
            ${metaItemsHtml}
            <div id="tooltip-markdown-container" style="line-height: 1.4; color: #444; font-size: 13px;">
            </div>
          `);
          
        // Convert Markdown to HTML and insert it into the container
        if (item.description && typeof item.description === 'string') {
          const container = document.getElementById('tooltip-markdown-container');
          if (container) {
            // Use marked to convert Markdown to HTML
            container.innerHTML = marked(item.description);
          }
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 5);
        
        d3.select(tooltipRef.current)
          .style('opacity', 0);
      })
      .on('click', function() {
        onItemClick(item);
      });
    });

  }, [data, rings, quadrants, dimensions, onItemClick, getColorForRing, getRingTextColor]);

  return (
    <ChartContainer>
      <svg ref={svgRef}></svg>
      <Tooltip ref={tooltipRef}></Tooltip>
    </ChartContainer>
  );
};

export default RadarChart;
