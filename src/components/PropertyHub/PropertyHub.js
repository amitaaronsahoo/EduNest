import UIComponent from '../../core/UIComponent.js';
import state from '../../core/StateManager.js';
import { calculateDistanceInMiles } from '../../utils/calculations.js';
import { currency, generateZillowUrl } from '../../utils/formatters.js';
import { hasCoordinates } from '../../utils/validators.js';

export default class PropertyHub extends UIComponent {
    constructor() {
        super();
        this.element = null;
        this.houseData = null;

        this.close = this.close.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.copyAddress = this.copyAddress.bind(this);
    }

    mount(container) {
        this.container = container;
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

    getClosestSchools() {
        const allSchools = state.get('schools') || [];
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
        const levelLower = String(level || '').toLowerCase();
        if (levelLower.includes('elementary')) return 'bg-green-100 text-green-800';
        if (levelLower.includes('middle')) return 'bg-blue-100 text-blue-800';
        if (levelLower.includes('high')) return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
    }

    render() {
        this.destroyView();

        const closestSchools = this.getClosestSchools();
        const priceFormatted = currency(this.houseData.price);
        const zillowUrl = generateZillowUrl(this.houseData.formattedAddress, this.houseData.zip);

        const html = `
      <div class="fixed inset-0 z-[1000] flex flex-col bg-bg-light overflow-hidden" role="dialog" aria-modal="true">
        <nav class="flex justify-between items-center bg-[#0f172a] text-white px-4 py-3 shadow">
          <h2 class="m-0 text-base">Property & Proximity Hub</h2>
          <button id="ph-close-btn" class="text-text-light hover:text-white font-bold px-3 py-2 rounded">✕ Back to Search</button>
        </nav>

        <div class="flex-1 overflow-y-auto p-4 md:p-8">
          <div class="max-w-5xl mx-auto">
            <div class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md mb-6">
              <strong>Important Zoning Notice (2026-2027)</strong>
              <p class="mt-1 text-sm">
                Schools displayed are geographically closest, which <strong>does not guarantee</strong> official JCPS enrollment zoning. Due to ongoing consolidations, please verify boundaries using the official JCPS SchoolFinder.
              </p>
            </div>

            <section class="bg-bg-white rounded-lg shadow-lg border border-border-light p-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 class="text-2xl font-extrabold text-primary m-0">${this.houseData.formattedAddress}</h3>
                <p class="text-lg text-text-light font-medium mt-2">
                  ${priceFormatted} &bull; ${this.houseData.bedrooms || 0} Bed / ${this.houseData.bathrooms || 0} Bath
                </p>
              </div>

              <div class="flex flex-col gap-2 min-w-[200px]">
                <a href="${zillowUrl}" target="_blank" rel="noopener noreferrer" class="inline-block text-center font-bold px-4 py-2 rounded-md bg-secondary text-white no-underline">
                  View on Zillow ↗
                </a>
                <button id="ph-copy-btn" class="text-secondary font-semibold px-3 py-2 rounded-md hover:bg-[#e6f6f3]">Copy Plain Address</button>
              </div>
            </section>

            <section>
              <h2 class="text-xl font-semibold mb-4 border-b border-border-light pb-2">Top 10 Closest JCPS Schools</h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${closestSchools.map(school => `
                  <article class="bg-bg-white p-5 rounded-lg border border-border-light flex flex-col gap-2 transition hover:border-primary">
                    <div class="flex justify-between items-start">
                      <h3 class="font-bold text-primary m-0">${school.SCH_NAME || school.name || 'Unnamed School'}</h3>
                      <span class="text-xs font-bold px-2 py-1 rounded ${this.getBadgeClass(school.LEVEL_ || school.level)}">
                        ${school.LEVEL_ || school.level || 'N/A'}
                      </span>
                    </div>
                    <div class="text-text-light text-sm font-medium">
                      📍 ${school.distance.toFixed(2)} miles away
                    </div>
                  </article>
                `).join('')}
              </div>
            </section>
          </div>
        </div>
      </div>
    `;

        const template = document.createElement('template');
        template.innerHTML = html.trim();
        this.element = template.content.firstChild;
        this.container.appendChild(this.element);

        document.body.style.overflow = 'hidden';
        this.bindEvents();
    }

    bindEvents() {
        const closeBtn = this.element.querySelector('#ph-close-btn');
        const copyBtn = this.element.querySelector('#ph-copy-btn');

        if (closeBtn) closeBtn.addEventListener('click', this.close);
        if (copyBtn) copyBtn.addEventListener('click', this.copyAddress);

        document.addEventListener('keydown', this.handleKeydown);
    }

    copyAddress(e) {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(this.houseData.formattedAddress || '');
        const btn = e.target;
        const prev = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => { btn.textContent = prev || "Copy Plain Address"; }, 2000);
    }

    handleKeydown(e) {
        if (e.key === 'Escape') this.close();
    }

    close() {
        state.set('activeHubProperty', null);
    }

    destroyView() {
        if (this.element) {
            document.removeEventListener('keydown', this.handleKeydown);
            document.body.style.overflow = '';
            this.element.remove();
            this.element = null;
        }
    }

    destroy() {
        this.destroyView();
    }
}