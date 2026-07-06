/**
 * src/components/PropertyHub/PropertyHub.js
 * SPA Component managing the US-2.4 full-screen overlay.
 */

import UIComponent from '../../core/UIComponent.js';
import state from '../../core/StateManager.js';
import { calculateDistanceInMiles } from '../../utils/calculations.js';
import { currency, generateZillowUrl } from '../../utils/formatters.js';
import { hasCoordinates } from '../../utils/validators.js';
import './PropertyHub.css';

export default class PropertyHub extends UIComponent {
    constructor() {
        super();
        this.element = null;
        this.houseData = null;
        
        // Bind methods to maintain 'this' context during event callbacks
        this.close = this.close.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.copyAddress = this.copyAddress.bind(this);
    }

    /**
     * Component Lifecycle: Mount
     * Subscribes to the global StateManager for the 'activeHubProperty' key.
     */
    mount(container) {
        this.container = container;
        // Subscribe to state changes. When a property is selected, this triggers.
        state.subscribe('activeHubProperty', this.handleStateChange.bind(this));
    }

    handleStateChange(houseData) {
        this.houseData = houseData;
        if (this.houseData) {
            this.render();
        } else {
            this.destroyView();
        }
    }

    /**
     * Executes the Haversine spatial calculation against the master schools list
     * @returns {Array} Top 10 closest schools
     */
    getClosestSchools() {
        const allSchools = state.get('schools') || [];
        
        // 1. Filter out invalid coordinates
        // 2. Map distance
        // 3. Sort ascending
        // 4. Slice top 10
        return allSchools
            .filter(school => hasCoordinates(school))
            .map(school => ({
                ...school,
                distance: calculateDistanceInMiles(
                    this.houseData.latitude, 
                    this.houseData.longitude, 
                    school.latitude, 
                    school.longitude
                )
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);
    }

    getBadgeClass(level) {
        const levelLower = String(level).toLowerCase();
        if (levelLower.includes('elementary')) return 'propertyHub__badge--elementary';
        if (levelLower.includes('middle')) return 'propertyHub__badge--middle';
        if (levelLower.includes('high')) return 'propertyHub__badge--high';
        return 'propertyHub__badge--elementary'; // fallback
    }

    /**
     * Component Lifecycle: Render
     * Creates DOM nodes using Template Literals and attaches event listeners.
     */
    render() {
        // Destroy existing view to prevent duplication
        this.destroyView();

        const closestSchools = this.getClosestSchools();
        const priceFormatted = currency(this.houseData.price);
        const zillowUrl = generateZillowUrl(this.houseData.formattedAddress);

        // Generate HTML structure
        const html = `
            <div class="propertyHub" role="dialog" aria-modal="true">
                <nav class="propertyHub__nav">
                    <h2 style="margin:0; font-size:1.125rem;">Property & Proximity Hub</h2>
                    <button class="propertyHub__closeBtn" id="ph-close-btn">&#10005; Back to Search</button>
                </nav>

                <div class="propertyHub__scrollArea">
                    <div class="propertyHub__container">
                        
                        <!-- Ethical Safeguard -->
                        <div class="propertyHub__alert" role="alert">
                            <strong>Important Zoning Notice (2026-2027)</strong>
                            <p style="margin-top:0.25rem; font-size:0.875rem;">
                                Schools displayed are geographically closest, which <strong>does not guarantee</strong> official JCPS enrollment zoning. Due to ongoing consolidations, please verify boundaries using the official JCPS SchoolFinder.
                            </p>
                        </div>

                        <!-- Hero Property Data -->
                        <section class="propertyHub__hero">
                            <div>
                                <h3 class="propertyHub__heroTitle">${this.houseData.formattedAddress}</h3>
                                <p class="propertyHub__heroDetails">
                                    ${priceFormatted} &bull; ${this.houseData.bedrooms || 0} Bed / ${this.houseData.bathrooms || 0} Bath
                                </p>
                            </div>
                            <div class="propertyHub__actions">
                                <a href="${zillowUrl}" target="_blank" rel="noopener noreferrer" class="propertyHub__zillowBtn">
                                    View on Zillow &nearr;
                                </a>
                                <button class="propertyHub__copyBtn" id="ph-copy-btn">Copy Plain Address</button>
                            </div>
                        </section>

                        <!-- Schools Grid -->
                        <section>
                            <h2 style="font-size:1.25rem; margin-bottom:1rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem;">
                                Top 10 Closest JCPS Schools
                            </h2>
                            <div class="propertyHub__grid">
                                ${closestSchools.map(school => `
                                    <article class="propertyHub__schoolCard">
                                        <div class="propertyHub__schoolHeader">
                                            <h3 class="propertyHub__schoolName">${school.SCH_NAME || school.name}</h3>
                                            <span class="propertyHub__badge ${this.getBadgeClass(school.LEVEL_ || school.level)}">
                                                ${school.LEVEL_ || school.level}
                                            </span>
                                        </div>
                                        <div style="color: #475569; font-size: 0.875rem; font-weight: 500;">
                                            &#x1F4CD; ${school.distance.toFixed(2)} miles away
                                        </div>
                                    </article>
                                `).join('')}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        `;

        // Create DOM element from string
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        this.element = template.content.firstChild;

        // Append to container (SPA style)
        this.container.appendChild(this.element);
        
        // Trap background scrolling
        document.body.style.overflow = 'hidden';

        this.bindEvents();
    }

    bindEvents() {
        const closeBtn = this.element.querySelector('#ph-close-btn');
        const copyBtn = this.element.querySelector('#ph-copy-btn');

        closeBtn.addEventListener('click', this.close);
        copyBtn.addEventListener('click', this.copyAddress);
        
        // Keyboard trap for accessibility
        document.addEventListener('keydown', this.handleKeydown);
    }

    copyAddress(e) {
        navigator.clipboard.writeText(this.houseData.formattedAddress);
        const btn = e.target;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = "Copy Plain Address"; }, 2000);
    }

    handleKeydown(e) {
        if (e.key === 'Escape') this.close();
    }

    close() {
        // Clearing the state automatically triggers handleStateChange -> destroyView
        state.set('activeHubProperty', null); 
    }

    /**
     * Component Lifecycle: Destroy/Cleanup
     * Strictly removes DOM elements and event listeners to prevent memory leaks.
     */
    destroyView() {
        if (this.element) {
            document.removeEventListener('keydown', this.handleKeydown);
            document.body.style.overflow = ''; // Unlock scroll
            this.element.remove();
            this.element = null;
        }
    }

    // Called by AppShell if completely unmounting the component
    destroy() {
        this.destroyView();
    }
}