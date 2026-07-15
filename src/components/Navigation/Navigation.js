import './Navigation.css';
import { UIComponent } from "../../core/UIComponent.js";

// Make sure to import your services so they don't throw undefined errors
import SchoolService from "../../services/SchoolService.js";
import HomeService from "../../services/HomeService.js";
import SavedHousesService from "../../services/SavedHousesService.js";

export class Navigation extends UIComponent {
    constructor(props) {
        super(props);
        // Set the initial active tab from props, fallback to "schools"
        this.activeTab = this.props.activeTab || "schools";
    }

    render() {
        // 1. Determine which service content to render
        let content = "";
        if (this.activeTab === "schools") {
            content = new SchoolService().render();
        } else if (this.activeTab === "homes") {
            content = new HomeService().render();
        } else if (this.activeTab === "saved") {
            content = new SavedHousesService().render();
        }

        // 2. Return the clean Tailwind-styled HTML
        return `
      <nav class="flex flex-wrap gap-2.5" role="tablist" aria-label="Main navigation">
        ${this.createTabButton("schools", "Schools")}
        ${this.createTabButton("homes", "Homes")}
        ${this.createTabButton("saved", "Saved")}
      </nav>

      <div class="tab-content mt-4">
        ${content}
      </div>
    `;
    }

    /**
     * Helper method to keep the render function clean
     */
    createTabButton(tabId, label) {
        const isActive = this.activeTab === tabId;

        // Define your Tailwind classes for active and inactive states
        const activeClasses = "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg";

        // Note: ensure 'bg-bg-light-blue' is defined in your tailwind.config.js,
        // otherwise replace it with a standard class like 'bg-blue-50'
        const inactiveClasses = "bg-bg-light-blue text-primary hover:bg-white hover:shadow";

        return `
      <button data-tab="${tabId}"
              class="px-4 py-2 rounded-full font-bold cursor-pointer transition transform ${isActive ? activeClasses : inactiveClasses}"
              aria-pressed="${isActive}">
        ${label}
      </button>
    `;
    }

    onMounted() {
        // Initial visibility check
        this.toggleContentVisibility(this.activeTab);

        // Delegate click events to the navigation buttons
        this.addDelegatedListener("click", "[data-tab]", (event) => {
            // Use .closest() to safely catch clicks on inner elements (like icons or spans)
            const target = event.target.closest('[data-tab]');
            if (!target) return;

            const newTab = target.dataset.tab;

            // Prevent unnecessary re-renders if clicking the already active tab
            if (this.activeTab === newTab) return;

            // Update state and re-render the component to apply the new Tailwind classes
            this.activeTab = newTab;
            this.update();

            // Toggle the DOM elements
            this.toggleContentVisibility(newTab);

            // Fire the external callback if provided
            if (typeof this.props.onChangeTab === 'function') {
                this.props.onChangeTab(newTab);
            }
        });
    }

    /**
     * Toggles the display style of the content containers
     */
    toggleContentVisibility(tab) {
        const schoolEl = document.getElementById("school-content");
        const homeEl = document.getElementById("home-content");
        const savedEl = document.getElementById("saved-content");

        if (schoolEl) schoolEl.style.display = tab === "schools" ? "block" : "none";
        if (homeEl) homeEl.style.display = tab === "homes" ? "block" : "none";
        if (savedEl) savedEl.style.display = tab === "saved" ? "block" : "none";
    }
}

export default Navigation;;