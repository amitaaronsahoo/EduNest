import './SavedHomes.css';
import { UIComponent } from "../../core/UIComponent.js";

export class SavedHomes extends UIComponent {
  render() {
    return `
      <section class="saved-homes">
        <h2>My Saved Homes</h2>
        <div id="savedHouses" class="cards">
          <div id="emptyState" class="empty-state">No homes saved yet</div>
        </div>
      </section>
    `;
  }
}

export default SavedHomes;
