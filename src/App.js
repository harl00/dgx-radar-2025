import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './App.css';

// Import components
import Header from './components/Header';
import RadarChart from './components/RadarChart';
import DetailView from './components/DetailView';
import LoadingSpinner from './components/LoadingSpinner';
import DataModal from './components/DataModal';
import InstructionModal from './components/InstructionModal';
import PrintView from './components/PrintView';
import PrintSettings from './components/PrintSettings';

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

const PrintLink = styled(DataLink)`
  margin-left: 20px;
`;

const SettingsOverlay = styled.div`
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

function App() {
  const [data, setData] = useState([]);
  const [rings, setRings] = useState([]);
  const [quadrants, setQuadrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showPrintSettings, setShowPrintSettings] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    title: '',
    subtitle: '',
    introduction: ''
  });

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
          // Error fetching data from Google Sheets, continue to fallback data
        }
        
        // If we reach here, either the fetch failed or returned no data
        // Use sample data as fallback
        setData(sampleData);
        
        // Extract unique quadrants from sample data
        const uniqueQuadrants = [...new Set(sampleData.map(item => item.quadrant))].filter(Boolean);
        
        // Set rings in the desired order
        const orderedRings = ['0-6m', '6-12m', '1-2y', '3y+'];
        
        setRings(orderedRings);
        setQuadrants(uniqueQuadrants);
        
        setError('Note: Using sample data for visualization. In a production environment, you would connect to a valid Google Sheets URL.');
        setLoading(false);
      } catch (err) {
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
  
  const handleShowPrintSettings = () => {
    setShowPrintSettings(true);
  };
  
  const handleClosePrintSettings = () => {
    setShowPrintSettings(false);
  };
  
  const handlePrintSettingsSubmit = (settings) => {
    setPrintSettings(settings);
    setShowPrintSettings(false);
    setShowPrintView(true);
  };
  
  const handleClosePrintView = () => {
    setShowPrintView(false);
  };

  // If print view is active, render only the print view
  if (showPrintView) {
    return (
      <PrintView
        data={data}
        rings={rings}
        quadrants={quadrants}
        title={printSettings.title || "Digital Skills Visualisation"}
        subtitle={printSettings.subtitle || "Interactive visualisation of projected impacts and concerns around Digital Skills in Government"}
        introduction={printSettings.introduction}
        onBack={handleClosePrintView}
      />
    );
  }

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
      
      {showInstructionModal && (
        <InstructionModal 
          onClose={() => setShowInstructionModal(false)} 
        />
      )}
      
      <Footer>
        <p>Technology Radar Visualization &copy; {new Date().getFullYear()}</p>
        <div>
          <DataLink 
            onClick={() => setShowInstructionModal(true)} 
            target="_self"
          >
            How to Use
          </DataLink>
          <DataLink 
            onClick={() => setShowDataModal(true)} 
            target="_self"
            style={{ marginLeft: '20px' }}
          >
            View Raw Data
          </DataLink>
          <PrintLink
            onClick={handleShowPrintSettings}
            target="_self"
          >
            Print View
          </PrintLink>
        </div>
      </Footer>
      
      {showPrintSettings && (
        <SettingsOverlay onClick={(e) => {
          if (e.target === e.currentTarget) handleClosePrintSettings();
        }}>
          <PrintSettings
            onSubmit={handlePrintSettingsSubmit}
            onCancel={handleClosePrintSettings}
            defaultTitle="Digital Skills Visualisation"
            defaultSubtitle="Interactive visualisation of projected impacts and concerns around Digital Skills in Government"
          />
        </SettingsOverlay>
      )}
    </AppContainer>
  );
}

export default App;
