/**
 * UIComponent.js
 * Base class for all UI components in the EduNest SPA.
 * 
 * Provides:
 * - Lifecycle management (mount, update, destroy)
 * - Template Literal rendering
 * - Event listener management with automatic cleanup
 * - State subscriptions to StateManager
 */

export class UIComponent {
  constructor(props = {}, stateManager = null) {
    this.props = props;
    this.stateManager = stateManager;
    this.element = null;
    this.eventListeners = [];
    this.stateSubscriptions = [];
    this.childComponents = [];
    this.isDestroyed = false;
  }

  /**
   * Render method (template) - Override in subclasses
   * Must return an HTML string created with Template Literals
   * @returns {string} HTML string
   */
  render() {
    return '';
  }

  /**
   * Mount component to DOM
   * @param {HTMLElement} container - Parent element to append to
   */
  mount(container) {
    if (this.isDestroyed) {
      console.warn(`Cannot mount destroyed component: ${this.constructor.name}`);
      return;
    }

    const html = this.render();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    this.element = wrapper.firstElementChild;

    if (!this.element) {
      console.error(`Component ${this.constructor.name} render() returned invalid HTML`);
      return;
    }

    container.appendChild(this.element);
    this.onMounted();
  }

  /**
   * Re-render component and update DOM
   * Useful when props or internal state changes
   */
  update() {
    if (this.isDestroyed || !this.element) return;

    const newHtml = this.render();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = newHtml.trim();
    const newElement = wrapper.firstElementChild;

    if (newElement && this.element.parentNode) {
      this.element.parentNode.replaceChild(newElement, this.element);
      this.element = newElement;
      this.onUpdated();
    }
  }

  /**
   * Lifecycle hook - called after mount
   * Override in subclasses for initialization logic
   */
  onMounted() {}

  /**
   * Lifecycle hook - called after update
   * Override in subclasses for update logic
   */
  onUpdated() {}

  /**
   * Lifecycle hook - called before destroy
   * Override in subclasses for cleanup logic
   */
  onBeforeDestroy() {}

  /**
   * Add event listener with automatic tracking for cleanup
   * @param {string} eventType - Event type (e.g., 'click', 'input')
   * @param {Function} handler - Event handler function
   * @param {HTMLElement} target - Element to attach listener to (defaults to this.element)
   */
  addEventListener(eventType, handler, target = null) {
    const element = target || this.element;
    if (!element) {
      console.warn(`Cannot add event listener: element not mounted yet`);
      return;
    }

    element.addEventListener(eventType, handler);
    this.eventListeners.push({ eventType, handler, element });
  }

  /**
   * Add delegated event listener (for dynamic child elements)
   * @param {string} eventType - Event type (e.g., 'click')
   * @param {string} selector - CSS selector for delegated target
   * @param {Function} handler - Event handler function
   */
  addDelegatedListener(eventType, selector, handler) {
    const wrapper = (event) => {
      const target = event.target.closest(selector);
      if (target) {
        handler.call(target, event);
      }
    };

    this.addEventListener(eventType, wrapper);
  }

  /**
   * Subscribe to state changes
   * Component will automatically update when watched state keys change
   * @param {string|string[]} keys - State key(s) to watch
   * @param {Function} callback - Callback when state changes
   */
  subscribeToState(keys, callback) {
    if (!this.stateManager) return;

    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach(key => {
      this.stateManager.subscribe(key, callback);
      this.stateSubscriptions.push({ key, callback });
    });
  }

  /**
   * Unsubscribe from all state watchers
   */
  unsubscribeFromState() {
    if (!this.stateManager) return;

    this.stateSubscriptions.forEach(({ key, callback }) => {
      this.stateManager.unsubscribe(key, callback);
    });
    this.stateSubscriptions = [];
  }

  /**
   * Register a child component for lifecycle management
   * @param {UIComponent} component - Child component instance
   */
  registerChildComponent(component) {
    if (!this.childComponents.includes(component)) {
      this.childComponents.push(component);
    }
  }

  /**
   * Destroy component and clean up
   * Removes from DOM, clears event listeners, destroys children
   */
  destroy() {
    if (this.isDestroyed) return;

    this.onBeforeDestroy();

    // Destroy child components first
    this.childComponents.forEach(child => child.destroy());
    this.childComponents = [];

    // Remove event listeners
    this.eventListeners.forEach(({ eventType, handler, element }) => {
      element.removeEventListener(eventType, handler);
    });
    this.eventListeners = [];

    // Unsubscribe from state
    this.unsubscribeFromState();

    // Remove from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;

    this.isDestroyed = true;
  }

  /**
   * Query selector within component element
   * @param {string} selector - CSS selector
   * @returns {HTMLElement|null}
   */
  querySelector(selector) {
    if (!this.element) return null;
    return this.element.querySelector(selector);
  }

  /**
   * Query all matching elements within component
   * @param {string} selector - CSS selector
   * @returns {NodeList}
   */
  querySelectorAll(selector) {
    if (!this.element) return [];
    return this.element.querySelectorAll(selector);
  }

  /**
   * Safely get value from state
   * @param {string} key - State key
   * @returns {*} State value or undefined
   */
  getStateValue(key) {
    if (!this.stateManager) return undefined;
    return this.stateManager.get(key);
  }
}

export default UIComponent;
