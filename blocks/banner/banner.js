export default function decorate(block) {
  const data = {};
  const children = Array.from(block.children);

  children.forEach((childDiv, index) => {
    const innerDivs = Array.from(childDiv.children);

    if (innerDivs.length >= 2) {
      // Caso key/value
      const key = innerDivs[0].textContent.trim().toLowerCase();
      const value = innerDivs[1].textContent.trim();
      data[key] = value;
    } else if (innerDivs.length === 1) {
      // Caso solo value, basado en el orden
      const value = innerDivs[0].textContent.trim();
      if (index === 0) data.message = value;
      else if (index === 1) data.variation = value;
      else data[`field${index}`] = value;
    }
  });

  // Limpiar contenido original
  block.innerHTML = '';

  // Agregar clase según variation
  if (data.variation) {
    block.classList.add(`banner-lf-${data.variation}`);
  }

  // Crear wrapper y agregar solo message
  const wrapper = document.createElement('div');
  wrapper.className = 'banner-content';

  if (data.message) {
    const msg = document.createElement('div');
    msg.className = 'banner-message';
    msg.textContent = data.message;
    wrapper.appendChild(msg);
  }

  block.appendChild(wrapper);

  return data;
}
