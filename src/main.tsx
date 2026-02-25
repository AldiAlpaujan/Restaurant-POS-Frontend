import "./styles/index.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

ModuleRegistry.registerModules([AllCommunityModule]);
createRoot(document.getElementById("root")!).render(<App />);
