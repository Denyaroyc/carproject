
import axios from 'axios';
import { mock } from 'node:test';

// In a real application, this would be your backend API URL
// For this demo, we'll simulate the backend with local data processing
const API_BASE_URL = '/api';

interface Filter {
  column: string;
  type: 'startsWith' | 'equals' | 'contains'; // Extend as needed
  value: string;
}

interface Params {
  search?: string;
  filters?: Filter[];
}

export interface CarData {
  _id: string;
  Brand: string;
  Model: string;
  AccelSec: number;
  TopSpeed_KmH: number;
  Range_Km: number;
  Efficiency_WhKm: number;
  FastCharge_KmH: number;
  RapidCharge: string;
  PowerTrain: string;
  PlugType: string;
  BodyStyle: string;
  Segment: string;
  Seats: number;
  PriceEuro: number;
  Date: string;
}

export interface FilterCriteria {
  column: string;
  type: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'isEmpty' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface SearchAndFilterParams {
  search?: string;
  filters?: FilterCriteria[];
  page?: number;
  pageSize?: number;
}

class BackendService {
  private mockData: CarData[] = [];

  // constructor() {
  //   this.loadMockData();
  // }

  // private async loadMockData() {
  //   try {
  //     // Load CSV data and convert to objects
  //     const response = await fetch('/Test_Data_ElectricCarData.csv');
  //     const csvText = await response.text();
  //     const lines = csvText.trim().split('\n');
  //     const headers = lines[0].split(',').map(header => header.trim());

  //     this.mockData = lines.slice(1).map((line, index) => {
  //       const values = line.split(',').map(value => value.trim());
  //       const car: any = { id: `car-${index + 1}` };

  //       headers.forEach((header, i) => {
  //         const value = values[i].trim(); // Trim whitespace from the value
  //         if (['AccelSec', 'TopSpeed_KmH', 'Range_Km', 'Efficiency_WhKm', 'FastCharge_KmH', 'Seats', 'PriceEuro'].includes(header.trim())) { // Trim header too
  //           car[header.trim()] = parseFloat(value) || 0;
  //         } else if (header.trim() === 'Date') { // Special handling for Date field
  //           car[header.trim()] = value;
  //         } else {
  //           car[header.trim()] = value;
  //         }
  //       });

  //       return car as CarData;
  //     });
  //   } catch (error) {
  //     console.error('Error loading mock data:', error);
  //     this.mockData = [];
  //   }
  // }

  private applyFilters(data: CarData[], filters: FilterCriteria[]): CarData[] {
    return data.filter(item => {
      return filters.every(filter => {
        const value = (item as any)[filter.column]?.toString().toLowerCase() || '';
        const filterValue = filter.value.toLowerCase();

        switch (filter.type) {
          case 'contains':
            return value.includes(filterValue);
          case 'equals':
            return value === filterValue;
          case 'startsWith':
            return value.startsWith(filterValue);
          case 'endsWith':
            return value.endsWith(filterValue);
          case 'isEmpty':
            return value === '';
          case 'greaterThan':
            return parseFloat(value) > parseFloat(filterValue);
          case 'lessThan':
            return parseFloat(value) < parseFloat(filterValue);
          default:
            return true;
        }
      });
    });
  }

  private applySearch(data: CarData[], searchTerm: string): CarData[] {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(term)
      )
    );
  }



  async getData(filterparams: SearchAndFilterParams = {}): Promise<{ data: CarData[], total: number }> {
    const url = new URL('/api/cars', 'http://localhost:5000'); // Adjust base URL as needed
    const params = new URLSearchParams();

    if (filterparams.search) {
      params.append('search', filterparams.search);
    }

    // Convert filters array into flat query structure
    if (filterparams.filters && filterparams.filters.length > 0) {
      filterparams.filters.forEach((filter, index) => {
        params.append(`filters[${index}][column]`, filter.column);
        params.append(`filters[${index}][type]`, filter.type);
        params.append(`filters[${index}][value]`, filter.value);
      });
    }

    const response = await fetch(`${url.toString()}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    var temp = [];
    const data = await response.json(); // Wait for the JSON to be ready
    this.mockData = data; // Update mockData with fetched data
    console.log('Data:', data, 'Total:', data.length);
    console.log('url',`${url.toString()}?${params.toString()}`)
    return {
      data: data,
      total: data.length
    };
  // response.json().then(data => {
  //   console.log('Data:', data, 'Total:', data.length);
  //   temp.push(...data);
  // });
  // console.log('Filtered Data:', temp);
  // return {
  //     data: temp,
  //     total: temp.length
  //  };
   }

  // async getData(params: SearchAndFilterParams = {}): Promise<{ data: CarData[], total: number }> {

  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 300));

  //   let filteredData = [...this.mockData];

  //   // Apply search
  //   if (params.search) {
  //     filteredData = this.applySearch(filteredData, params.search);
  //   }

  //   // Apply filters
  //   if (params.filters && params.filters.length > 0) {
  //     filteredData = this.applyFilters(filteredData, params.filters);
  //   }
  //   console.log('Filtered Data:', filteredData);
  //   return {
  //     data: filteredData,
  //     total: filteredData.length
  //   };
  // }

  async getById(id: string): Promise < CarData | null > {
      // Simulate API delay
      const url = new URL(`/api/car`, 'http://localhost:5000'); // Adjust base URL as needed
          const params = new URLSearchParams();

    if (id) {
      params.append('id', id);
        }

          const response = await fetch(`${url.toString()}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    var temp = [];
    const data = await response.json(); // Wait for the JSON to be ready
    console.log('Data:', data, 'Total:', data.length);
    return data;

    }

  async deleteById(id: string): Promise < boolean > {
      // Simulate API delay
      const url = new URL(`/api/car`, 'http://localhost:5000'); // Adjust base URL as needed
          const params = new URLSearchParams();

    if (id) {
      params.append('id', id);
        }

          const response = await fetch(`${url.toString()}?${params.toString()}`, {
    method: 'DELETE',
  });
    if (!response.ok) throw new Error('Failed to fetch data');
    var temp = [];
    const data = await response.json(); // Wait for the JSON to be ready
    console.log('Data:', data, 'Total:', data.length);
    return data;
  }
//   async getById(id: string): Promise<CarData | null> {
//   const response = await fetch(`/api/cars/${id}`);
//   if (!response.ok) return null;
//   return await response.json();
// }

//   async deleteById(id: string): Promise<boolean> {
//     const response = await fetch(`${API_BASE_URL}/cars/${id}`, { method: 'DELETE' });
//     return response.ok;
//   }
}

export const backendService = new BackendService();
