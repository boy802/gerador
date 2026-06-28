async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();

    document.getElementById('totalCodes').innerText = `Total de códigos: ${stats.total}`;
    document.getElementById('availableCodes').innerText = `Disponíveis: ${stats.available}`;
    document.getElementById('usedCodes').innerText = `Usados: ${stats.used}`;
    document.getElementById('todayCodes').innerText = `Entregues hoje: ${stats.today || 0}`;
    document.getElementById('totalBatches').innerText = `Total de lotes: ${stats.batches}`;

    const table = document.getElementById('lastUsedTable');
    table.innerHTML = '';
    stats.lastUsed.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.code}</td><td>${item.created_at}</td>`;
      table.appendChild(row);
    });
  } catch (err) {
    console.error('Erro ao buscar stats', err);
  }
}

// Atualiza a cada 5 segundos
setInterval(fetchStats, 5000);
fetchStats();
