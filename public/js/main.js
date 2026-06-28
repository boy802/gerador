function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showModal(content) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<div class="modal-content">${content}<button onclick="closeModal()">Fechar</button></div>`;
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

function closeModal() {
  document.querySelector('.modal').remove();
}

function showLoading() {
  const loader = document.createElement('div');
  loader.className = 'loading';
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.querySelector('.loading');
  if (loader) loader.remove();
}
