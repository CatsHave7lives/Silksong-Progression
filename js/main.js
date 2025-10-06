import * as objective from './objectiveLists.js';

document.addEventListener('DOMContentLoaded', async function () {
	document.body.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) {
            localStorage.setItem(e.target.id, e.target.checked);
        }
    });
	// ... inside 'DOMContentLoaded' ...

function loadCheckboxStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const savedState = localStorage.getItem(checkbox.id);
        // If a saved state exists, apply it
        if (savedState !== null) {
            checkbox.checked = (savedState === 'true');
        }
    });
}
	try {
		const container = document.getElementById('content-container');
		if (!container) { return; }
		
		const response = await fetch('data/act_1.json');
		const data = await response.json();

		const globalTotalCounts = new Map();
		data.advancement.forEach(adv => {
			adv.area.forEach(area => {
				area['sub-area'].forEach(subArea => {
					if (subArea.lists) {
						const listCollection = subArea.lists[0];
						for (const categoryKey in listCollection) {
							const items = listCollection[categoryKey];
							items.forEach(item => {
								globalTotalCounts.set(item.name, (globalTotalCounts.get(item.name) || 0) + 1);
							});
						}
					}
				});
			});
		});

		const globalItemCounts = new Map();
		let generatedHTML = '';
		data.advancement.forEach(adv => {
			generatedHTML += `
				<h2 class="advancement">
					<div class="hr-left"></div>
					<span class="title">
					<span style="color: ${adv['action-color']}">${adv.action}: </span>
					<span style="color: ${adv['entity-color']}">${adv.entity}</span>
					</span>
					<div class="hr-right"></div>
				</h2>
			`;
			adv.area.forEach(area => {
				generatedHTML += `
					<section class="area" style="--area-background: url(../assets/images/menu/${area['area-background']}); --area-title-color: ${area['area-color']}">
					<h3>${area.title}</h3>
				`;
				area['sub-area'].forEach(subArea => {
					generatedHTML += `
						<h4>
							<span>${subArea.title}</span>
							<div class="hr-right"></div>
						</h4>
					`;
					if (subArea.lists && Array.isArray(subArea.lists)) {
						const listCollection = subArea.lists[0]; // Renamed for clarity
					
						for (const categoryKey in listCollection) { // <-- FIXED (camelCase 'K')
							const listData = listCollection[categoryKey]; // <-- Uses the corrected variable
							generatedHTML += objective.createObjectiveListHTML(categoryKey, listData, globalItemCounts, globalTotalCounts); // <-- Passes the corrected variable
						}
					}
				});
				generatedHTML += `</section>`;
			});
		});
		container.innerHTML = generatedHTML;
		loadCheckboxStates();
	} catch (error) {
		console.error("Failed to load or process data:", error);
	}
});