document.addEventListener('submit', (event) => {
  const button = event.target.querySelector('button[type="submit"]');
  if (button && !button.dataset.noLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Processando...';
  }
});
