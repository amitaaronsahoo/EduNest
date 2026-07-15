import { UIComponent } from "../../core/UIComponent.js";

export class SavedHomes extends UIComponent {
  render() {
    return `
      <section class="grid gap-4">
        <h2 class="text-lg font-semibold text-primary">My Saved Homes</h2>

        <div id="savedHouses" class="grid gap-3">
          <div id="emptyState" class="text-text-muted">No homes saved yet</div>
        </div>
      </section>
    `;
  }
}

export default SavedHomes;