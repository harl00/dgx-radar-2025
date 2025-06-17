import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
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

const SettingsHeader = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
`;

const SettingsTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
`;

const SettingsDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:focus {
    outline: none;
  }
`;

const CancelButton = styled(Button)`
  background-color: #e0e0e0;
  color: #333;
  
  &:hover {
    background-color: #d0d0d0;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #3498db;
  color: white;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const HelpText = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #666;
`;

const PrintSettings = ({ onSubmit, onCancel, defaultTitle, defaultSubtitle }) => {
  const [title, setTitle] = useState(defaultTitle || 'Technology Radar');
  const [subtitle, setSubtitle] = useState(defaultSubtitle || 'Interactive visualization of technology trends');
  const [introduction, setIntroduction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, subtitle, introduction });
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Print Settings</SettingsTitle>
        <SettingsDescription>Customize your radar print view</SettingsDescription>
      </SettingsHeader>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter radar title"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input 
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter radar subtitle"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="introduction">Introduction (Markdown supported)</Label>
          <TextArea 
            id="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="# Introduction

Write a brief introduction to your radar here. 

You can use **Markdown** formatting:
* Bullet points
* _Italic_ and **bold** text
* [Links](https://example.com)

## Sections
You can create sections with headings."
          />
          <HelpText>
            Use Markdown to format your introduction. Headings, lists, links, and basic formatting are supported.
          </HelpText>
        </FormGroup>
        
        <ButtonContainer>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit">
            Continue to Print View
          </SubmitButton>
        </ButtonContainer>
      </form>
    </SettingsContainer>
  );
};

export default PrintSettings;
