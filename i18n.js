(() => {
  const placeholder = /\{\{([\w.-]+)\}\}/g;
  const textTemplates = [];
  const attributeTemplates = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);

  // Collect text and attribute templates before rendering the Italian content.
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent.includes('{{')) {
      textTemplates.push({ node, template: node.textContent });
    }
  }
  document.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      if (attribute.value.includes('{{')) {
        attributeTemplates.push({ element, name: attribute.name, template: attribute.value });
      }
    });
  });

  const buttons = document.querySelectorAll('[data-language]');

  function setLanguage() {
    const selected = 'it';
    const strings = languageTranslations[selected];
    const translate = template => template.replace(placeholder, (token, key) =>
      strings[key] ?? languageTranslations.it[key] ?? token
    );

    textTemplates.forEach(({ node, template }) => {
      node.textContent = translate(template);
    });
    attributeTemplates.forEach(({ element, name, template }) => {
      element.setAttribute(name, translate(template));
    });
    document.documentElement.lang = selected;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === selected));
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  setLanguage();
})();
