import { UIComponent } from "../../core/UIComponent.js";

export class Navigation extends UIComponent {
  render() {
    const activeTab = this.props.activeTab || "schools";

    return `
      <nav class="app-nav">
        <button type="button" class="app-nav__button ${activeTab === "schools" ? "is-active" : ""}" data-tab="schools">📚 Schools</button>
        <button type="button" class="app-nav__button ${activeTab === "homes" ? "is-active" : ""}" data-tab="homes">🏠 Homes</button>
        <button type="button" class="app-nav__button ${activeTab === "saved" ? "is-active" : ""}" data-tab="saved">💾 Saved Homes</button>
      </nav>
    `;
  }

  onMounted() {
    this.addDelegatedListener("click", "[data-tab]", event => {
      this.props.onChangeTab?.(this.dataset.tab || event.target?.dataset.tab);
    });
  }
}

export default Navigation;
