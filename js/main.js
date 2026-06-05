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
		
		const currentDataFile = container.getAttribute('data-json') || 'data/act_1.json';

		// 1. Define all your act files in order here!
		// Add 'data/act_3.json' etc. to this array as you build them.
		const allActFiles = ['data/act_1.json', 'data/act_2.json']; 
		
		// 2. Fetch all data so we know the global totals and previous counts
		const allData = [];
		for (const file of allActFiles) {
			const response = await fetch(file);
			const jsonData = await response.json();
			allData.push({ file: file, data: jsonData });
		}

		// 3. Count the absolute global totals across ALL acts
		const globalTotalCounts = new Map();
		allData.forEach(actObj => {
			actObj.data.advancement.forEach(adv => {
				adv.area.forEach(area => {
					area['sub-area'].forEach(subArea => {
						if (subArea.lists) {
							const listCollection = subArea.lists[0];
							for (const categoryKey in listCollection) {
								listCollection[categoryKey].forEach(item => {
									globalTotalCounts.set(item.name, (globalTotalCounts.get(item.name) || 0) + 1);
								});
							}
						}
					});
				});
			});
		});

		const globalItemCounts = new Map();
		let generatedHTML = '';

		// 4. Loop through acts in order to increment counters, but ONLY build HTML for the current act
		allData.forEach(actObj => {
			const isCurrentAct = (actObj.file === currentDataFile);

			actObj.data.advancement.forEach(adv => {
				if (isCurrentAct) {
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
				}
				
				adv.area.forEach(area => {
					if (isCurrentAct) {
						generatedHTML += `
							<section class="area" style="--area-background: url(../assets/images/menu/${area['area-background']}); --area-title-color: ${area['area-color']}">
							<h3>${area.title}</h3>
						`;
					}

					area['sub-area'].forEach(subArea => {
						if (isCurrentAct) {
							generatedHTML += `
								<h4>
									<span>${subArea.title}</span>
									<div class="hr-right"></div>
								</h4>
							`;
						}

						if (subArea.lists && Array.isArray(subArea.lists)) {
							const listCollection = subArea.lists[0];
						
							for (const categoryKey in listCollection) {
								const listData = listCollection[categoryKey];
								
								if (isCurrentAct) {
									// Build HTML and increment counts normally for the page we are on
									generatedHTML += objective.createObjectiveListHTML(categoryKey, listData, globalItemCounts, globalTotalCounts);
								} else {
									// If it's a previous act, quietly increment the counts in the background so numbering stays continuous
									listData.forEach(item => {
										const currentIndex = globalItemCounts.get(item.name) || 0;
										globalItemCounts.set(item.name, currentIndex + 1);
									});
								}
							}
						}
					});

					if (isCurrentAct) {
						generatedHTML += `</section>`;
					}
				});
			});
		});

		container.innerHTML = generatedHTML;
		loadCheckboxStates();
	} catch (error) {
		console.error("Failed to load or process data:", error);
	}
});