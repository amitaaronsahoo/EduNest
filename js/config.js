const DATA_PATHS = {
  houses: "data/houses.json",
  schools: "data/Jefferson_County_KY_Schools (1).geojson",
};

const SCHOOL_ICON_URL = "https://cdn2.iconfinder.com/data/icons/school-pack-2/512/1-1024.png";

const SCHOOL_LEVEL_LABELS = {
  E: "Elementary",
  M: "Middle",
  S: "Secondary",
  H: "Special",
  C: "Combined",
};

const state = {
  houses: [],
  schools: [],
  filteredHomes: [],
  schoolsFiltered: [],
};

let savedHouses = [];
let savedHouseIds = new Set();
let currentTab = "schools";
let map;
let markersLayer;
let detailMap;
let detailMarkersLayer;
let currentHouseDetail = null;
let lastSelectedSchool = null;
let lastNearbyHomes = [];