import getVariants from './variants.js';

import {
  findVariant,
} from '../../scripts/theme-utils.js';

function decorateUniversalEditor(block) {
  const divContainers = block.querySelectorAll(':scope > div');

  const blockSettings = {};
  const variant = findVariant(divContainers);

  if (divContainers.length > 1
    && variant !== null
    && variant.index !== 1) {
    blockSettings.link = divContainers[1].innerText?.trim();
  }

  if (divContainers.length > 2
    && variant !== null
    && variant.index !== 2) {
    blockSettings.text = divContainers[2].innerText?.trim();
  }

  if (variant !== null && variant.value !== '0') {
    block.classList.add(variant.value);
  }

  const anchor = document.createElement('a');
  anchor.classList.add('acc-button--link');

  anchor.href = blockSettings.link || '';
  anchor.innerHTML = blockSettings.text;

  block.innerHTML = '';
  block.append(anchor);
}

export default function decorate(a) {
  const blockWrapper = a.parentElement;

  if (blockWrapper.classList.contains('acc-button-wrapper')
    && a.tagName === 'DIV') {
    decorateUniversalEditor(a);
    return;
  }

  if (a.nodeName !== 'A') return;

  if (a.href !== a.textContent) {
    if (!a.querySelector('img')) {
      const up = a.parentElement;
      const editorElem = a.closest('.acc-button');

      if (up.childNodes.length === 1 && !editorElem) { // Case for Word
        a.className = 'acc-button--link'; // default
        up.classList.add('acc-button');
        const variants = getVariants();
        const cmpVariant = up.dataset.variant;
        if (variants) {
          if (cmpVariant) {
            const variantProperties = variants[cmpVariant];
            if (variantProperties && variantProperties.typography) {
              up.classList.add(variantProperties.typography);
            }
          } else {
            const defaultVariant = Object.values(variants).find((v) => v.componentVariantDefault === 'true');
            if (defaultVariant) {
              up.classList.add(defaultVariant.typography);
            }
          }
        }
      }
    }
  }
}
