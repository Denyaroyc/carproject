
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { CarData } from '../services/backendService';

interface ActionsCellRendererProps {
  data: CarData;
  onView: (data: CarData) => void;
  onDelete: (data: CarData) => void;
}

const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({ 
  data, 
  onView, 
  onDelete 
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          color="primary"
          onClick={() => onView(data)}
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(data)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActionsCellRenderer;
