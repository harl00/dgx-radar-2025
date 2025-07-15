import React, { useState, useEffect } from 'react';
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
  max-width: 800px;
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
  line-height: 1.6;
  
  h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  h2 {
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 15px;
  }
  
  h3 {
    color: #34495e;
    margin-top: 25px;
    margin-bottom: 10px;
  }
  
  h4 {
    color: #34495e;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 15px;
    color: #555;
  }
  
  ul, ol {
    margin-bottom: 15px;
    padding-left: 25px;
  }
  
  li {
    margin-bottom: 8px;
    color: #555;
  }
  
  strong {
    color: #2c3e50;
  }
  
  code {
    background-color: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    color: #e74c3c;
  }
  
  blockquote {
    border-left: 4px solid #3498db;
    margin: 20px 0;
    padding: 10px 20px;
    background-color: #f8f9fa;
    font-style: italic;
    color: #666;
  }
  
  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 30px 0;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  background-color: #fdf2f2;
  border-radius: 4px;
  margin: 20px;
`;

const InstructionModal = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInstructions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/instructions.md');
        
        if (!response.ok) {
          throw new Error('Failed to load instructions');
        }
        
        const markdownText = await response.text();
        const htmlContent = marked(markdownText, { 
          breaks: true, 
          gfm: true 
        });
        
        setContent(htmlContent);
        setError(null);
      } catch (err) {
        setError('Unable to load instructions. Please try again later.');
        console.error('Error loading instructions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInstructions();
  }, []);

  // Handle click on the background to close
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close
  useEffect(() => {
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
          <ModalTitle>How to Use This Application</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {loading && (
            <LoadingMessage>Loading instructions...</LoadingMessage>
          )}
          
          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
          
          {!loading && !error && (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default InstructionModal;
