import './styles/index.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/i18n.ts';

ModuleRegistry.registerModules([AllCommunityModule]);
createRoot(document.getElementById('root')!).render(<App />);
