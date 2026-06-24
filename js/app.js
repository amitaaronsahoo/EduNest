// UNIFIED EDUNEST + TEST PROJECT APP
// ============================================

const DATA_PATHS = {
  houses: "data/houses.json",
  schools: "data/Jefferson_County_KY_Schools (1).geojson"
};

const SCHOOL_ICON_URL = "https://cdn2.iconfinder.com/data/icons/school-pack-2/512/1-1024.png";

const SCHOOL_LEVEL_LABELS = {
  E: "Elementary",
  M: "Middle",
  S: "Secondary",
  H: "Special",
  C: "Combined"
};

const state = {
  houses: [],
  schools: [],
  filteredHomes: [],
  schoolsFiltered: []
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

// ============================================
// LOGIN & USER MANAGEMENT
// ============================================


// ============================================
// DOM ELEMENTS
// ============================================

const elements = {

  // Schools sidebar
  schoolSearch: document.getElementById("schoolSearch"),
  schoolSearchBtn: document.getElementById("schoolSearchBtn"),
  maxTuition: document.getElementById("maxTuition"),
  maxTuitionValue: document.getElementById("maxTuitionValue"),
  applyFiltersBtn: document.getElementById("applyFiltersBtn"),
  schoolResults: document.getElementById("schoolResults"),
  schoolsList: document.getElementById("schoolsTableBody"),
  AllSchoolBtn: document.getElementById("allSchoolBtn"),

  // Homes sidebar
  schoolSearchHome: document.getElementById("schoolSearchHome"),
  schoolSearchHomeBtn: document.getElementById("schoolSearchHomeBtn"),
  minBedrooms: document.getElementById("minBedrooms"),
  minBathrooms: document.getElementById("minBathrooms"),
  maxPriceHome: document.getElementById("maxPriceHome"),
  maxPriceValue: document.getElementById("maxPriceValue"),
  applyFiltersHomeBtn: document.getElementById("applyFiltersHomeBtn"),
  homeResults: document.getElementById("homeResults"),
  houseDetailTitle: document.getElementById("houseDetailTitle"),
  houseDetailSubtitle: document.getElementById("houseDetailSubtitle"),
  detailBackBtn: document.getElementById("detailBackBtn"),
  houseDetailNotes: document.getElementById("houseDetailNotes"),
  houseMaxTuition: document.getElementById("houseMaxTuition"),
  houseMaxTuitionValue: document.getElementById("houseMaxTuitionValue"),
  houseApplySchoolFiltersBtn: document.getElementById("houseApplySchoolFiltersBtn"),
  houseSchoolResults: document.getElementById("houseSchoolResults"),
  houseNearbySchools: document.getElementById("houseNearbySchools"),
  houseDetailInfo: document.getElementById("houseDetailInfo"),

  // Content areas
  resultsTitle: document.getElementById("resultsTitle"),
  results: document.getElementById("results"),
  emptyState: document.getElementById("emptyState"),
  savedHousesList: document.getElementById("savedHousesList"),
  savedHousesCount: document.getElementById("savedHousesCount"),
  savedHouses: document.getElementById("savedHouses")
};

// ============================================
// TAB SWITCHING
// ============================================



document.addEventListener("DOMContentLoaded", () => {
  loadData().then(bindEvents).catch(err => {
    console.error("Initialization error:", err);
  });
});