
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendService, CarData, FilterCriteria } from '../services/backendService';
import ActionsCellRenderer from './ActionsCellRenderer';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataGridProps {
  title?: string;
}

const DataGrid: React.FC<DataGridProps> = ({ title = 'Electric Cars Data' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [newFilter, setNewFilter] = useState<FilterCriteria>({
    column: '',
    type: 'contains',
    value: ''
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch data with search and filters
  const { data: gridData, isLoading, error, refetch } = useQuery({
    queryKey: ['cars', searchTerm, filters],
    queryFn: () => {
      console.log('Search Term:', searchTerm, 'Filters:', filters);
      return backendService.getData({ search: searchTerm, filters });
    },
    staleTime: 30000, // 30 seconds
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => backendService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    { field: 'Brand', headerName: 'Brand', sortable: true, filter: true, width: 120 },
    { field: 'Model', headerName: 'Model', sortable: true, filter: true, width: 150 },
    { 
      field: 'AccelSec', 
      headerName: 'Acceleration (sec)', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 160,
      valueFormatter: (params) => `${params.value}s`
    },
    { 
      field: 'TopSpeed_KmH', 
      headerName: 'Top Speed (km/h)', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 160,
      valueFormatter: (params) => `${params.value} km/h`
    },
    { 
      field: 'Range_Km', 
      headerName: 'Range (km)', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 140,
      valueFormatter: (params) => `${params.value} km`
    },
    { 
      field: 'Efficiency_WhKm', 
      headerName: 'Efficiency (Wh/km)', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 170
    },
    { 
      field: 'FastCharge_KmH', 
      headerName: 'Fast Charge (km/h)', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 170
    },
    { field: 'RapidCharge', headerName: 'Rapid Charge', sortable: true, filter: true, width: 140 },
    { field: 'PowerTrain', headerName: 'Powertrain', sortable: true, filter: true, width: 130 },
    { field: 'PlugType', headerName: 'Plug Type', sortable: true, filter: true, width: 130 },
    { field: 'BodyStyle', headerName: 'Body Style', sortable: true, filter: true, width: 130 },
    { field: 'Segment', headerName: 'Segment', sortable: true, filter: true, width: 110 },
    { 
      field: 'Seats', 
      headerName: 'Seats', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 100
    },
    { 
      field: 'PriceEuro', 
      headerName: 'Price (€)', 
      sortable: true, 
      filter: 'agNumberColumnFilter',
      width: 130,
      valueFormatter: (params) => `€${params.value.toLocaleString()}`
    },
    {
      field: 'Date',
      headerName: 'Date',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onView: (data: CarData) => navigate(`/car/${data._id}`),
        onDelete: (data: CarData) => {
          if (window.confirm(`Are you sure you want to delete ${data.Brand} ${data.Model}?`)) {
            deleteMutation.mutate(data._id);
          }
        }
      },
      width: 140,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ], [navigate, deleteMutation]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);
  

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAddFilter = () => {
    if (newFilter.column && newFilter.value) {
      setFilters(prev => [...prev, { ...newFilter }]);
      setNewFilter({ column: '', type: 'contains', value: '' });
    }
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setFilters([]);
    if (gridApi) {
      gridApi.setFilterModel(null);
    }
  };

  // Get available columns for filter dropdown
  const availableColumns = columnDefs
    .filter(col => col.field !== 'actions')
    .map(col => ({ value: col.field!, label: col.headerName || col.field! }));

  return (
    <Paper sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Search */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search all fields"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isLoading}
            startIcon={<Search />}
          >
            Search
          </Button>
        </Box>

        {/* Filter Controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Column</InputLabel>
            <Select
              value={newFilter.column}
              onChange={(e) => setNewFilter(prev => ({ ...prev, column: e.target.value }))}
              label="Column"
            >
              {availableColumns.map(col => (
                <MenuItem key={col.value} value={col.value}>
                  {col.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 130 }}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={newFilter.type}
              onChange={(e) => setNewFilter(prev => ({ ...prev, type: e.target.value as any }))}
              label="Filter Type"
            >
              <MenuItem value="contains">Contains</MenuItem>
              <MenuItem value="equals">Equals</MenuItem>
              <MenuItem value="startsWith">Starts With</MenuItem>
              <MenuItem value="endsWith">Ends With</MenuItem>
              <MenuItem value="isEmpty">Is Empty</MenuItem>
              <MenuItem value="greaterThan">Greater Than</MenuItem>
              <MenuItem value="lessThan">Less Than</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Filter Value"
            variant="outlined"
            value={newFilter.value}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            disabled={newFilter.type === 'isEmpty'}
            sx={{ minWidth: 150 }}
          />

          <Button
            variant="outlined"
            onClick={handleAddFilter}
            disabled={!newFilter.column || (!newFilter.value && newFilter.type !== 'isEmpty')}
            startIcon={<FilterList />}
          >
            Add Filter
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearAll}
            startIcon={<Clear />}
          >
            Clear All
          </Button>
        </Box>

        {/* Active Filters */}
        {filters.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1 }}>
              Active Filters:
            </Typography>
            {filters.map((filter, index) => (
              <Chip
                key={index}
                label={`${filter.column} ${filter.type} "${filter.value}"`}
                onDelete={() => handleRemoveFilter(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data. Please try again.
        </Alert>
      )}

      {/* Data Grid */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {isLoading && (
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={gridData?.data || []}
            onGridReady={onGridReady}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true,
            }}
            pagination={true}
            paginationPageSize={20}
            suppressCellFocus={true}
            rowSelection="single"
            animateRows={true}
          />
        </div>
      </Box>

      {/* Data Summary */}
      {gridData && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {gridData.data.length} of {gridData.total} records
          </Typography>
          {deleteMutation.isPending && (
            <Typography variant="body2" color="primary">
              Deleting...
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DataGrid;
