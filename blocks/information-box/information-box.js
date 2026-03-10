export default function decorate(block) {
  block.classList.add('information-box');

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.classList.add('information-box-wrapper');

  // Grab the main structure: two <div> inside block
  const [leftWrapper, rightWrapper] = block.children[0]?.children || [];
  if (!leftWrapper) return;

  // --- LEFT COLUMN ---
  const left = document.createElement('div');
  left.classList.add('information-box-left');

  // Extract main table inside left column
  const mainTable = leftWrapper.querySelector('table');
  if (!mainTable) return;

  const mainCells = mainTable.querySelectorAll(':scope > tbody > tr > td');
  const [mainLeftCell, mainRightCell] = mainCells;

  // Main content (left inner col)
  const main = document.createElement('div');
  main.classList.add('information-box-main');

  if (mainLeftCell) {
    mainLeftCell.childNodes.forEach((n) => main.appendChild(n.cloneNode(true)));
  }

  // Cards content (right inner col)
  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('information-box-cards');

  if (mainRightCell) {
    const cardTables = mainRightCell.querySelectorAll(':scope > table');
    cardTables.forEach((table, i) => {
      const td = table.querySelector('td');
      if (!td) return;

      const card = document.createElement('div');
      card.classList.add('information-box-card');
      card.dataset.index = i + 1;

      td.childNodes.forEach((n) => card.appendChild(n.cloneNode(true)));
      cardsWrapper.appendChild(card);
    });
  }

  left.append(main, cardsWrapper);

  // --- RIGHT COLUMN ---
  const right = document.createElement('div');
  right.classList.add('information-box-right');

  if (rightWrapper) {
    rightWrapper.childNodes.forEach((n) => right.appendChild(n.cloneNode(true)));
  }

  // --- FINAL DOM ---
  wrapper.append(left, right);
  block.innerHTML = '';
  block.append(wrapper);
}
