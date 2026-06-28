async function loadDashboard() {
  const totalCodes = document.getElementById('totalCodes');
  const availableCodes = document.getElementById('availableCodes');
  const usedCodes = document.getElementById('usedCodes');
  const todayCodes = document.getElementById('todayCodes');
  const totalBatches = document.getElementById('totalBatches');
  const lastUsedTable = document.getElementById('lastUsedTable');

  try {
    const response = await fetch('/api/stats');
    if (!response.ok) throw new Error('Falha ao carregar estatísticas');

    const stats = await response.json();
    totalCodes.textContent = stats.total;
    availableCodes.textContent = stats.available;
    usedCodes.textContent = stats.used;
    todayCodes.textContent = stats.usedToday;
    totalBatches.textContent = stats.batches;

    if (!stats.lastUsed.length) {
      lastUsedTable.innerHTML = '<tr><td colspan="2">Nenhum código usado ainda.</td></tr>';
      return;
    }

    lastUsedTable.innerHTML = stats.lastUsed
      .map(item => `<tr><td><code>${item.code || '-'}</code></td><td>${item.created_at}</td></tr>`)
      .join('');
  } catch (error) {
    lastUsedTable.innerHTML = '<tr><td colspan="2">Não foi possível carregar os dados.</td></tr>';
    console.error(error);
  }
}

loadDashboard();
