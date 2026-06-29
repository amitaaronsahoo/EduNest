/*******************************************************************************
* FILENAME     :    DistanceFilter.js       
* DESIGN REF   :    EDUNEST-FR3
* DESCRIPTION  :    Distance filtering by their proximity radius to a specified school.
* AUTHOR       :    Jakob Schroll
* START DATE   :    27 Jun 2026
******************************************************************************/


import { UIComponent } from "../../core/UIComponent.js";
import { StateManager } from "../../core/StateManager.js";
import './DistanceFilter.css';

export default class DistanceFilter extends UIComponent {
  constructor(containerId) {
    
    super({}, new StateManager());
    this.container = document.querySelector(containerId);
    // Starting Value 
    this.currentRadius = 5;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = this.render();
    this.element = this.container.firstElementChild;
    this.bindEvents();
  }


  // 25 might be too small
  render() {
    return `
      <div class="distance-filter-wrapper">
        <label for="distanceRadius" class="filter-label">
          Maximum Distance to School: <span id="radiusValue" class="badge">${this.currentRadius}</span> miles
        </label>
        <input 
          id="distanceRadius" 
          type="range" 
          min="1" 
          max="25" 
          step="1" 
          value="${this.currentRadius}" 
          class="win98-slider"
        />
      </div>
    `;
  }

  bindEvents() {
    const slider = this.container.querySelector('#distanceRadius');
    const valueDisplay = this.container.querySelector('#radiusValue');

    if (!slider) return;

    slider.addEventListener('input', (event) => {
      const targetValue = Number(event.target.value);
      this.currentRadius = targetValue;
      
      if (valueDisplay) {
        valueDisplay.textContent = String(targetValue);
      }

      
      const globalState = new StateManager();
      globalState.publish('searchRadiusUpdate', targetValue);
    });
  }
}