(() => {
  const placeholder = /\{\{([\w.-]+)\}\}/g;
  const storageKey = 'papimileggiunlibro-language';
  const textTemplates = [];
  const attributeTemplates = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);

  // Keep the templates so switching languages never depends on rendered text.
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

  function setLanguage(language) {
    const selected = language === 'en' ? 'en' : 'it';
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

  buttons.forEach(button => button.addEventListener('click', () => {
    const language = button.dataset.language;
    setLanguage(language);
    try { localStorage.setItem(storageKey, language); } catch { /* Storage may be disabled. */ }
  }));

  document.getElementById('year').textContent = new Date().getFullYear();
  try { setLanguage(localStorage.getItem(storageKey)); } catch { setLanguage('it'); }
})();
