// API Base URL
const API_BASE = '';

// Pagination state
let currentPage = 0;
const pageSize = 20;
let totalResults = 0;

// Store results for modal
let resultsCache = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkHealth();
  loadStatus();
  loadScheduler();
  loadResults();

  // Auto-refresh every 30 seconds
  setInterval(() => {
    loadStatus();
    loadScheduler();
  }, 30000);
});

// Check server health
async function checkHealth() {
  const statusEl = document.getElementById('serverStatus');
  const statusTextEl = document.getElementById('serverStatusText');

  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();

    if (data.status === 'ok') {
      statusEl.classList.remove('offline');
      statusEl.classList.add('online');
      statusTextEl.textContent = 'Сервер работает';
    } else {
      throw new Error('Server not ok');
    }
  } catch (error) {
    statusEl.classList.remove('online');
    statusEl.classList.add('offline');
    statusTextEl.textContent = 'Сервер недоступен';
  }
}

// Load status and statistics
async function loadStatus() {
  try {
    const response = await fetch(`${API_BASE}/api/status`);
    const data = await response.json();

    if (data.success) {
      const stats = data.data.statistics;
      const scores = data.data.averageScores;

      // Update statistics
      document.getElementById('totalPrompts').textContent = stats.totalPrompts;
      document.getElementById('totalResponses').textContent = stats.totalResponses;
      document.getElementById('totalEvaluations').textContent = stats.totalEvaluations;
      document.getElementById('pendingEvaluations').textContent = stats.pendingEvaluations;

      // Update average scores
      if (scores) {
        updateScoreBar('coherence', scores.coherence);
        updateScoreBar('consistency', scores.consistency);
        updateScoreBar('fluency', scores.fluency);
        updateScoreBar('relevance', scores.relevance);
        document.getElementById('overallScore').textContent = Math.round(scores.avg_score);
      } else {
        document.getElementById('overallScore').textContent = '-';
      }

      // Update last evaluation
      if (data.data.lastEvaluationAt) {
        document.getElementById('lastEvaluation').textContent =
          formatDate(data.data.lastEvaluationAt);
      }
    }
  } catch (error) {
    console.error('Failed to load status:', error);
  }
}

// Update score bar
function updateScoreBar(name, value) {
  const bar = document.getElementById(`${name}Bar`);
  const valueEl = document.getElementById(`${name}Value`);

  if (bar && valueEl) {
    const percentage = (value / 5) * 100;
    bar.style.width = `${percentage}%`;
    valueEl.textContent = value.toFixed(2);
  }
}

// Load scheduler status
async function loadScheduler() {
  try {
    const response = await fetch(`${API_BASE}/api/scheduler`);
    const data = await response.json();

    if (data.success) {
      const scheduler = data.data;

      document.getElementById('schedulerEnabled').textContent =
        scheduler.enabled ? 'Включен' : 'Выключен';
      document.getElementById('schedulerSchedule').textContent =
        scheduler.schedule || '-';
      document.getElementById('schedulerRunning').textContent =
        scheduler.isRunning ? 'Да' : 'Нет';
    }
  } catch (error) {
    console.error('Failed to load scheduler:', error);
  }
}

// Load evaluation results
async function loadResults() {
  const tbody = document.getElementById('resultsBody');
  tbody.innerHTML = '<tr><td colspan="8" class="loading">Загрузка...</td></tr>';

  try {
    const offset = currentPage * pageSize;
    const response = await fetch(
      `${API_BASE}/api/results?limit=${pageSize}&offset=${offset}`
    );
    const data = await response.json();

    if (data.success) {
      resultsCache = data.data;
      totalResults = data.pagination.total;

      document.getElementById('resultsShown').textContent =
        Math.min(offset + pageSize, totalResults);
      document.getElementById('resultsTotal').textContent = totalResults;
      document.getElementById('pageInfo').textContent =
        `Страница ${currentPage + 1} из ${Math.ceil(totalResults / pageSize) || 1}`;

      // Update pagination buttons
      document.getElementById('prevPage').disabled = currentPage === 0;
      document.getElementById('nextPage').disabled =
        (currentPage + 1) * pageSize >= totalResults;

      if (data.data.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="8" class="no-data">Нет данных</td></tr>';
        return;
      }

      tbody.innerHTML = data.data.map((row, index) => {
        const response = row.responses;
        const prompt = response?.prompts;

        return `
          <tr>
            <td>${escapeHtml(response?.model_name || '-')}</td>
            <td>${formatScore(row.coherence)}</td>
            <td>${formatScore(row.consistency)}</td>
            <td>${formatScore(row.fluency)}</td>
            <td>${formatScore(row.relevance)}</td>
            <td>${formatAvgScore(row.avg_score)}</td>
            <td>${formatDate(row.evaluated_at)}</td>
            <td>
              <button class="details-btn" onclick="showDetails(${index})">
                Подробнее
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Failed to load results:', error);
    tbody.innerHTML =
      '<tr><td colspan="8" class="no-data">Ошибка загрузки</td></tr>';
  }
}

// Change page
function changePage(delta) {
  const newPage = currentPage + delta;
  const maxPage = Math.ceil(totalResults / pageSize) - 1;

  if (newPage >= 0 && newPage <= maxPage) {
    currentPage = newPage;
    loadResults();
  }
}

// Run evaluation
async function runEvaluation() {
  const btn = document.getElementById('evaluateBtn');
  const limit = document.getElementById('evaluateLimit').value || 10;
  const resultEl = document.getElementById('actionResult');

  btn.disabled = true;
  btn.textContent = 'Выполняется...';
  resultEl.classList.add('hidden');

  try {
    const response = await fetch(`${API_BASE}/api/evaluate?limit=${limit}`, {
      method: 'POST',
    });
    const data = await response.json();

    resultEl.classList.remove('hidden', 'error');
    resultEl.classList.add('success');

    if (data.success) {
      resultEl.textContent =
        `Успешно оценено: ${data.evaluated} ответов. ` +
        `Ошибок: ${data.failed}. Время: ${(data.duration / 1000).toFixed(1)}с`;

      // Reload data
      loadStatus();
      loadResults();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    resultEl.classList.remove('hidden', 'success');
    resultEl.classList.add('error');
    resultEl.textContent = `Ошибка: ${error.message}`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Запустить оценку';
  }
}

// Evaluate specific prompt
async function evaluatePrompt() {
  const promptId = document.getElementById('promptId').value.trim();
  const resultEl = document.getElementById('actionResult');

  if (!promptId) {
    resultEl.classList.remove('hidden', 'success');
    resultEl.classList.add('error');
    resultEl.textContent = 'Введите ID промпта';
    return;
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(promptId)) {
    resultEl.classList.remove('hidden', 'success');
    resultEl.classList.add('error');
    resultEl.textContent = 'Неверный формат UUID';
    return;
  }

  resultEl.classList.add('hidden');

  try {
    const response = await fetch(`${API_BASE}/api/evaluate/${promptId}`, {
      method: 'POST',
    });
    const data = await response.json();

    resultEl.classList.remove('hidden', 'error');

    if (data.success) {
      resultEl.classList.add('success');
      resultEl.textContent =
        `Оценено: ${data.evaluated} ответов для промпта. Ошибок: ${data.failed}`;

      loadStatus();
      loadResults();
    } else {
      resultEl.classList.add('error');
      resultEl.textContent = `Ошибка: ${data.message}`;
    }
  } catch (error) {
    resultEl.classList.remove('hidden', 'success');
    resultEl.classList.add('error');
    resultEl.textContent = `Ошибка: ${error.message}`;
  }
}

// Show details modal
function showDetails(index) {
  const row = resultsCache[index];
  if (!row) return;

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const response = row.responses;
  const prompt = response?.prompts;

  modalBody.innerHTML = `
    <div class="modal-section">
      <h4>Промпт</h4>
      <p>${escapeHtml(prompt?.text || 'N/A')}</p>
    </div>
    <div class="modal-section">
      <h4>Ответ (${escapeHtml(response?.model_name || 'Unknown')})</h4>
      <p>${escapeHtml(response?.response_text || 'N/A')}</p>
    </div>
    <div class="modal-section">
      <h4>Оценки</h4>
      <div class="modal-scores">
        <div class="modal-score-item">
          <span>Coherence</span>
          <span>${formatScore(row.coherence)}</span>
        </div>
        <div class="modal-score-item">
          <span>Consistency</span>
          <span>${formatScore(row.consistency)}</span>
        </div>
        <div class="modal-score-item">
          <span>Fluency</span>
          <span>${formatScore(row.fluency)}</span>
        </div>
        <div class="modal-score-item">
          <span>Relevance</span>
          <span>${formatScore(row.relevance)}</span>
        </div>
        <div class="modal-score-item">
          <span><strong>Общий балл</strong></span>
          <span><strong>${Math.round(row.avg_score)}%</strong></span>
        </div>
      </div>
    </div>
    <div class="modal-section">
      <h4>Метаданные</h4>
      <p>
        <strong>Модель-оценщик:</strong> ${escapeHtml(row.evaluator_model || 'N/A')}<br>
        <strong>Дата оценки:</strong> ${formatDate(row.evaluated_at)}<br>
        <strong>ID ответа:</strong> ${escapeHtml(row.response_id || 'N/A')}
      </p>
    </div>
    ${row.reasoning ? `
      <div class="modal-section">
        <h4>Обоснование</h4>
        <p>${escapeHtml(row.reasoning)}</p>
      </div>
    ` : ''}
  `;

  modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// Close modal on outside click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Helper: Format score with badge
function formatScore(score) {
  if (score == null) return '-';

  let badgeClass = 'score-medium';
  if (score >= 4) badgeClass = 'score-high';
  else if (score <= 2) badgeClass = 'score-low';

  return `<span class="score-badge ${badgeClass}">${score}</span>`;
}

// Helper: Format average score (0-100%)
function formatAvgScore(score) {
  if (score == null) return '-';

  let badgeClass = 'score-medium';
  if (score >= 75) badgeClass = 'score-high';
  else if (score <= 50) badgeClass = 'score-low';

  return `<span class="score-badge ${badgeClass}">${Math.round(score)}%</span>`;
}

// Helper: Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';

  const date = new Date(dateStr);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper: Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
