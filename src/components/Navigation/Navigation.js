import './Navigation.css';
import { UIComponent } from "../../core/UIComponent.js";

export class Navigation extends UIComponent {
 render() {
    const { activeTab } = this.state;

    let content = "";

    if (activeTab === "schools") {
        content = new SchoolService().render();
    } else if (activeTab === "homes") {
        content = new HomeService().render();
    } else if (activeTab === "saved") {
        content = new SavedHouseService().render();
    }

    return `
        ${new Navigation({
            activeTab,
            onChangeTab: tab => this.setState({ activeTab: tab })
        }).render()}

        <div class="tab-content">
            ${content}
        </div>
    `;
}

  onMounted() {
  const showTab = (tab) => {
    document.getElementById("school-content").style.display =
      tab === "schools" ? "block" : "none";

    document.getElementById("home-content").style.display =
      tab === "homes" ? "block" : "none";

    document.getElementById("saved-content").style.display =
      tab === "saved" ? "block" : "none";
  };

  // Show the initial tab
  showTab(this.props.activeTab || "schools");

  this.addDelegatedListener("click", "[data-tab]", event => {
    const tab = event.target.dataset.tab;

    showTab(tab);

    this.props.onChangeTab?.(tab);
  });
}
  }

export default Navigation;
