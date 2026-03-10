import {
  decorateBlock,
} from './aem.js';

function isCssSize(value) {
  const regex = /^-?\d+(\.\d+)?[a-zA-Z%]+$/;
  return regex.test(value.trim());
}

export function findVariant(divContainers) {
  if (!divContainers || divContainers.length < 1) {
    return null;
  }

  const lastIndex = divContainers.length - 1;
  const lastDiv = divContainers[lastIndex];
  const text = lastDiv?.innerText?.trim() || '';

  const match = text.match(/\[variant-([^\]]+)\]/);

  if (match) {
    return { index: lastIndex, value: match[1] };
  }

  return null;
}

/**
 * Applies variant classes to elements based on following [[variant: ...]] markers.
 *
 * Expected pattern:
 * <p>Some content</p>
 * <p>[[variant: primary]]</p>
 *
 * This optimized version scans only text nodes instead of all DOM elements.
 *
 * @param {HTMLElement} main - The root element to scan for variant markers.
 */
export function decorateVariants(main) {
  if (!main) return;

  // Create a TreeWalker to efficiently iterate only text nodes
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);

  const variantRegex = /^\s*\[\[variant:\s*([^\]]+)\]\]\s*$/;
  const toRemove = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.trim();
    const match = text.match(variantRegex);

    if (match) {
      const variantClass = match[1].trim();
      const parent = node.parentElement;

      // Apply to previous sibling element
      let prev = parent?.previousElementSibling;

      if (!prev && parent) {
        prev = parent.parentElement?.previousElementSibling;
      }

      if (prev) {
        prev.classList.add(variantClass);
        prev.dataset.variant = variantClass;
      }

      // Mark parent element for removal (we remove later to avoid messing traversal)
      if (parent) toRemove.push(parent);
    }
  }

  // Remove all marker elements after traversal
  toRemove.forEach((el) => el.remove());
}

export function decorateAccBlocks(main) {
  if (!main) return;

  const accRegex = /^\s*\[(acc-[^\]]+)\]\s*$/;

  // TreeWalker para recorrer todos los nodos de texto
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);

  const blocksToProcess = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.trim();

    const match = text.match(accRegex);
    if (match) {
      const accClass = match[1].trim();
      const parentEl = node.parentElement;
      if (parentEl) {
        const blockDiv = parentEl.closest(`.${accClass}`);
        blocksToProcess.push({ node, accClass, blockDiv });
      }
    }
  }

  blocksToProcess.forEach(({ node, accClass, blockDiv }) => {
    if (blockDiv) {
      if (typeof decorateBlock === 'function') {
        decorateBlock(blockDiv);
      }
      return;
    }

    const p = node.parentElement;
    let container = p ? p.parentElement : null;

    if (container && container.childElementCount === 1) {
      container = container.parentElement;
    }

    if (!container) return;

    const children = Array.from(container.children);
    let blockPs = [];
    let currentAccClass = accClass;

    children.forEach((child, idx) => {
      const text = child.textContent.trim();
      const match = text.match(accRegex);

      if (match) {
        if (blockPs.length > 0) {
          const newBlockDiv = document.createElement('div');
          newBlockDiv.classList.add(currentAccClass);

          blockPs.forEach((pEl) => {
            const innerWrapper = document.createElement('div');
            const innerDiv = document.createElement('div');
            innerDiv.textContent = pEl.textContent;
            innerWrapper.appendChild(innerDiv);
            newBlockDiv.appendChild(innerWrapper);
          });

          container.insertBefore(newBlockDiv, blockPs[0]);
          blockPs.forEach((pEl) => pEl.remove());

          if (typeof decorateBlock === 'function') {
            decorateBlock(newBlockDiv);
          }
        }

        currentAccClass = match[1].trim();
        blockPs = [child];
      } else if (currentAccClass) {
        blockPs.push(child);
      }

      if (idx === children.length - 1 && blockPs.length > 0) {
        const newBlockDiv = document.createElement('div');
        newBlockDiv.classList.add(currentAccClass);

        blockPs.forEach((pEl) => {
          const innerWrapper = document.createElement('div');
          const innerDiv = document.createElement('div');
          innerDiv.textContent = pEl.textContent;
          innerWrapper.appendChild(innerDiv);
          newBlockDiv.appendChild(innerWrapper);
        });

        container.insertBefore(newBlockDiv, blockPs[0]);
        blockPs.forEach((pEl) => pEl.remove());

        if (typeof decorateBlock === 'function') {
          decorateBlock(newBlockDiv);
        }
      }
    });
  });
}

export function decorateInlineSeparators(main) {
  if (!main) return;

  // Create a TreeWalker to efficiently iterate only text nodes
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);

  const separatorRegex = /^\s*\[\[separator:\s*(.+?)\s*\]\]\s*$/;
  const toRemove = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.trim();
    const match = text.match(separatorRegex);

    if (match) {
      const variantOrValue = match[1].trim();

      const block = document.createElement('div');
      block.classList.add('acc-separator');

      const blockInnerElem = document.createElement('div');
      blockInnerElem.classList.add('acc-separator__spacer');

      if (isCssSize(variantOrValue)) {
        block.style.height = variantOrValue;
      } else {
        block.classList.add(variantOrValue);
      }
      blockInnerElem.append(document.createElement('hr'));
      block.append(blockInnerElem);

      const existingParent = node.parentElement;
      existingParent.before(block);
      if (existingParent) toRemove.push(existingParent);
    }
  }

  // Remove all marker elements after traversal
  toRemove.forEach((el) => el.remove());
}

export function applyVariantAttributes(newElem, variantElem) {
  if (!newElem || !variantElem) return;

  newElem.classList.add(...variantElem.classList);

  Object.entries(variantElem.dataset).forEach(([key, value]) => {
    newElem.dataset[key] = value;
  });
}

export default decorateVariants;
