export function createObjectiveListHTML(categoryKey, items, itemCounts, globalTotals) {
	let displayTitle = '';
	let imagePath = '';
	let itemsHTML = '';
	let additionals = '';

	if (categoryKey === "mappings") {
		displayTitle = "Mapping Supplies";
		imagePath = "assets/images/item/mappings/";
	}
	else if (categoryKey === "npcs") {
		displayTitle = "Residents";
		imagePath = "assets/images/npcs/";
	}
	else if (categoryKey === "wishes") {
		displayTitle = "Wishes Promised";
		imagePath = "assets/images/wishes/";
	}
	else if (categoryKey === "quest-items") {
		displayTitle = "Quest Items";
		imagePath = "assets/images/item/quest-items/";
	}
	else if (categoryKey === "granted") {
		displayTitle = "Wishes Granted";
		imagePath = "assets/images/wishes/";
	}
	else if (categoryKey === "upgrades") {
		displayTitle = "Upgrades";
		imagePath = "assets/images/item/upgrades/";
	}
	else if (categoryKey === "tools") {
		displayTitle = "Tools";
		imagePath = "assets/images/item/tools/";
	}
	else if (categoryKey === "consumables") {
		displayTitle = "Consumables";
		imagePath = "assets/images/item/consumables/";
	}
	else if (categoryKey === "journal") {
		displayTitle = "Hunter's Journal";
		imagePath = "assets/images/journal/";
	}
	else if (categoryKey === "materium") {
		displayTitle = "Materium";
		imagePath = "assets/images/item/materium/";
	}
	// Add more 'else if' blocks for other categories...

	items.forEach(itemObject => {
		const currentIndex = itemCounts.get(itemObject.name) || 0;
		const total = globalTotals.get(itemObject.name);
		itemsHTML += listElementBuilder(itemObject, currentIndex, total, imagePath, itemObject.additionals);
		itemCounts.set(itemObject.name, currentIndex + 1);
	});

	if (itemsHTML) {
		return `
            <h5 style="--category-title-color: var(--color-category-title)">${displayTitle}:</h5>
            <ul class="objective-list">
                ${itemsHTML}
            </ul>
        `;
	}

	return '';
}

function listElementBuilder(itemObject, index, totalCount, imagePath, additionals) {
	const displayName = itemObject.name;
    const iconName = itemObject.icon || displayName; 

	const internalName = displayName.replace(/ /g, '_');
    const iconInternalName = iconName.replace(/ /g, '_');
	
    let count = '';
	let uniqueId = internalName;

	if (totalCount > 1) {
		count = ` #${index + 1}`;
		uniqueId = `${internalName}_${index + 1}`;
	}

	const fullImagePath = `${imagePath}${iconInternalName}.png`;

	return `
		<li>
			<!-- THIS IS THE CORRECTED LINE -->
			<input type="checkbox" id="${uniqueId}"> 
			<label for="${uniqueId}">
				<a href="https://hollowknight.wiki/w/${internalName}" title="${displayName}">
					<img class="icon" src="${fullImagePath}" alt="${displayName}">
				</a>
				<span>${displayName}</span>
				${additionals || ''}
				<span>${count}</span>
			</label>
		</li>
	`;
}