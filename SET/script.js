// In-memory Set to store unique visitors
let uniqueVisitors = new Set();

// DOM elements
const visitorForm = document.getElementById("visitorForm");
const visitorIdInput = document.getElementById("visitorId");
const totalVisitorsElement = document.getElementById("totalVisitors");
const visitorListElement = document.getElementById("visitorList");

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  renderVisitorList();
  updateStats();
});

// Handle form submission
visitorForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const visitorId = visitorIdInput.value.trim();

  if (visitorId) {
    addVisitor(visitorId);
    visitorIdInput.value = "";
    visitorIdInput.focus();
  }
});

// Add a new visitor
function addVisitor(visitorId) {
  // Add to Set (duplicates automatically ignored)
  const added = uniqueVisitors.add(visitorId);

  // Only update if actually added (not a duplicate)
  if (added.size > uniqueVisitors.size - 1) {
    renderVisitorList();
    updateStats();
  }
}

// Update statistics display
function updateStats() {
  totalVisitorsElement.textContent = uniqueVisitors.size;
}

// Render the visitor list
function renderVisitorList() {
  if (uniqueVisitors.size === 0) {
    visitorListElement.innerHTML =
      '<p class="empty-message">No visitors yet. Add your first visitor!</p>';
    return;
  }

  let html = "";
  uniqueVisitors.forEach((visitorId) => {
    html += `
            <div class="visitor-item">
                <span class="visitor-id">${escapeHtml(visitorId)}</span>
            </div>
        `;
  });

  visitorListElement.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
