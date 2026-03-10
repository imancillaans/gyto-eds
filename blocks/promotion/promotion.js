export default function decorate(block) {
  // Collect properties
  const blockProperties = {};
  const divContainers = block.querySelectorAll(':scope > div');

  if (divContainers.length > 0) {
    blockProperties.img = divContainers[0].querySelector('picture img');
  }

  if (divContainers.length > 1) {
    blockProperties.title = divContainers[1].innerText?.trim();
  }

  if (divContainers.length > 2) {
    blockProperties.text = divContainers[2].innerText?.trim();
  }

  blockProperties.buttons = [];
  if (divContainers.length > 3) {
    for (let i = 3; i < divContainers.length; i += 1) {
      blockProperties.buttons.push(divContainers[i]);
    }
  }

  // Build new markup
  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-promotion-block');

  if (blockProperties.img) {
    wrapper.style.backgroundImage = `
      linear-gradient(176.98deg, rgba(0, 0, 0, 0.6) 7.49%, rgba(0, 0, 0, 0) 95.15%),
      url('${blockProperties.img.src}')
    `;
    wrapper.style.backgroundSize = 'cover';
    wrapper.style.backgroundPosition = 'center';
  }

  const content = document.createElement('div');
  content.classList.add('hero-promotion-content');
  if (blockProperties.title || blockProperties.text) {
    const promotionTexts = document.createElement('div');
    promotionTexts.classList.add('hero-promotion-text');

    const titleElem = document.createElement('h2');
    titleElem.innerHTML = blockProperties.title;

    const textElem = document.createElement('p');
    textElem.innerHTML = blockProperties.text;

    promotionTexts.appendChild(titleElem);
    promotionTexts.appendChild(textElem);

    content.appendChild(promotionTexts);
  }

  if (blockProperties.buttons.length > 0) {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('hero-promotion-buttons');

    blockProperties.buttons.forEach((node) => {
      buttonsWrapper.appendChild(node);
    });

    content.appendChild(buttonsWrapper);
  }

  wrapper.appendChild(content);

  block.innerHTML = '';
  block.appendChild(wrapper);
}
