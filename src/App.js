import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';

// Import components
import Header from './components/Header';
import RadarChart from './components/RadarChart';
import DetailView from './components/DetailView';
import LoadingSpinner from './components/LoadingSpinner';
import DataModal from './components/DataModal';

// Import services
import DataService from './services/DataService';
import sampleData from './data/sampleData';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-height: 600px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
`;

const LoadingContainer = styled.div`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  color: #2c3e50;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
`;

const Footer = styled.footer`
  background-color: #f1f1f1;
  padding: 15px 30px;
  text-align: center;
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const DataLink = styled.button`
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #2980b9;
  }
`;

function App() {
  const [data, setData] = useState([]);
  const [rings, setRings] = useState([]);
  const [quadrants, setQuadrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch data from Google Sheets
        try {
          const fetchedData = await DataService.fetchData();
          
          if (fetchedData && fetchedData.length > 0) {
            setData(fetchedData);
            
            // Extract unique quadrants
            const uniqueQuadrants = DataService.getQuadrants();
            
            // Set rings in the desired order
            const orderedRings = ['0-6m', '6-12m', '1-2y', '3y+'];
            
            setRings(orderedRings);
            setQuadrants(uniqueQuadrants);
            setLoading(false);
            return; // Exit early if successful
          }
        } catch (err) {
          console.error('Error fetching data from Google Sheets:', err);
          // Continue to fallback data
        }
        
        // If we reach here, either the fetch failed or returned no data
        // Use sample data as fallback
        console.log('Using sample data visualization');
        console.log('Sample data:', sampleData);
        setData(sampleData);
        
        // Extract unique quadrants from sample data
        const uniqueQuadrants = [...new Set(sampleData.map(item => item.quadrant))].filter(Boolean);
        
        // Set rings in the desired order
        const orderedRings = ['0-6m', '6-12m', '1-2y', '3y+'];
        
        console.log('Rings in order:', orderedRings);
        
        setRings(orderedRings);
        setQuadrants(uniqueQuadrants);
        
        setError('Note: Using sample data for visualization. In a production environment, you would connect to a valid Google Sheets URL.');
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <AppContainer>
      <Header 
        title="Digital Skills Visualisation" 
        subtitle="Interactive visualisation of projected impacts and concerns around Digital Skills in Government"
      />
      
      <MainContent>
        {error && (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
          </ErrorContainer>
        )}
        
        <ChartContainer>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner text="Loading radar data..." />
            </LoadingContainer>
          ) : (
            <RadarChart 
              data={data} 
              rings={rings} 
              quadrants={quadrants} 
              onItemClick={handleItemClick}
            />
          )}
        </ChartContainer>
      </MainContent>
      
      {selectedItem && (
        <DetailView 
          item={selectedItem} 
          onClose={handleCloseDetail} 
        />
      )}
      
      {showDataModal && (
        <DataModal 
          data={data} 
          onClose={() => setShowDataModal(false)} 
        />
      )}
      
      <Footer>
        <p>Technology Radar Visualization &copy; {new Date().getFullYear()}</p>
        <DataLink onClick={() => setShowDataModal(true)}>
          View Raw Data
        </DataLink>
      </Footer>
    </AppContainer>
  );
}

export default App;
