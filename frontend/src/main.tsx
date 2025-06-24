import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';


// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
