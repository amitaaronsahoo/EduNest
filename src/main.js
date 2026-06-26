import "./styles/main.css";
import { StateManager } from "./core/StateManager.js";
import { DataService } from "./core/DataService.js";
import { MapService } from "./core/MapService.js";
import { SchoolService } from "./services/SchoolService.js";
import { HomeService } from "./services/HomeService.js";
import { SavedHousesService } from "./services/SavedHousesService.js";
import AppShell from "./components/AppShell/AppShell.js";

const stateManager = new StateManager();
const mapService = new MapService(stateManager);
const dataService = new DataService(stateManager);
const schoolService = new SchoolService(stateManager);
const homeService = new HomeService(stateManager);
const savedHousesService = new SavedHousesService(stateManager);

document.addEventListener("DOMContentLoaded", () => {
  const appRoot = document.getElementById("app");
  if (!appRoot) {
    throw new Error('Missing #app root element');
  }

  const app = new AppShell(
    {
      dataService,
      schoolService,
      homeService,
      savedHousesService,
      mapService
    },
    stateManager
  );

  app.mount(appRoot);
});
