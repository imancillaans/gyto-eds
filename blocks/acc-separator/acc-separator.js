import {
  findVariant,
} from '../../scripts/theme-utils.js';

function apply(block, blockSettings) {
  const hr = document.createElement('hr');

  const spacer = document.createElement('div');
  spacer.classList.add('acc-separator__spacer');
  spacer.append(hr);

  if (blockSettings.separation) {
    block.style.height = blockSettings.separation;
  }

  if (blockSettings.variant) {
    block.classList.add(blockSettings.variant);
  }

  block.innerHTML = '';
  block.append(spacer);
}

function decorateUniversalEditor(block) {
  const divContainers = block.querySelectorAll(':scope > div');
  const blockSettings = {};

  const variant = findVariant(divContainers);

  if (divContainers.length > 1
    && variant !== null
    && variant.index !== 1) {
    blockSettings.separation = divContainers[1].innerText;
  }

  if (variant !== null && variant.value !== '0') {
    blockSettings.variant = variant.value;
  }

  apply(block, blockSettings);
}

export default function decorate(block) {
  const blockWrapper = block.parentElement;

  if (blockWrapper.classList.contains('acc-separator-wrapper')
    && block.tagName === 'DIV') {
    decorateUniversalEditor(block);
    return;
  }
  const blockSettings = {};

  const pairContainers = block.querySelectorAll(':scope > div');

  pairContainers.forEach((container) => {
    const paragraphs = container.querySelectorAll('p');

    if (paragraphs.length >= 2) {
      const key = paragraphs[0].textContent.trim();
      const value = paragraphs[1].textContent.trim();
      blockSettings[key] = value;
    }
  });

  apply(block, blockSettings);
}
