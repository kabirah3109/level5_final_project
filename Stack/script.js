// 🔑 Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyA5VUHwPYroeQTdkGEiyr0qUXsPZARSVWE",
  authDomain: "undo-redo-app.firebaseapp.com",
  projectId: "undo-redo-app",
  storageBucket: "undo-redo-app.firebasestorage.app",
  messagingSenderId: "724862957342",
  appId: "1:724862957342:web:ec6a4fefbcba6746fffb0f",
  // measurementId: "G-3LFWDN7XTG"
};

//  Initialize Firebase (compat mode)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

//  Undo/Redo state
const undoStack = [];
const redoStack = [];
let lastSaveTime = null; // ← TEMP: force initial timestamp

//  DOM Elements
const newActionInput = document.getElementById("newAction");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const undoCount = document.getElementById("undoCount");
const redoCount = document.getElementById("redoCount");
const undoStackContent = document.getElementById("undoStack");
const redoStackContent = document.getElementById("redoStack");
const lastSavedElement = document.getElementById("last-saved");

// Enforce FIFO (queue) behavior only
const MODE = "FIFO";

//  Update UI
function updateUI() {
  undoCount.textContent = undoStack.length;
  redoCount.textContent = redoStack.length;
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;

  // Render undo stack (FIFO: front-first)
  if (undoStack.length === 0) {
    undoStackContent.innerHTML = '<div class="stack-empty">Empty</div>';
  } else {
    const items = undoStack.slice();
    undoStackContent.innerHTML = items
      .map((item) => `<div class="stack-item">${item}</div>`)
      .join("");
  }

  // Render redo stack (FIFO: front-first)
  if (redoStack.length === 0) {
    redoStackContent.innerHTML = '<div class="stack-empty">Empty</div>';
  } else {
    const items = redoStack.slice();
    redoStackContent.innerHTML = items
      .map((item) => `<div class="stack-item">${item}</div>`)
      .join("");
  }

  // Update save status
  if (lastSaveTime && (undoStack.length > 0 || redoStack.length > 0)) {
    lastSavedElement.innerHTML = `
        <span  class="status-badge">Saved</span>
        Last saved: ${lastSaveTime.toLocaleTimeString()}
    `;
  } else {
    lastSavedElement.innerHTML = `
        <span style="color: #6c757d; font-style: italic;">No data saved yet</span>
    `;
  }
}

//  Save to Firestore
async function saveToCloud() {
  try {
    if (!auth.currentUser) {
      await auth.signInAnonymously();
    }

    await db.collection("documents").doc("main").set({
      undoStack,
      redoStack,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    });

    lastSaveTime = new Date();
    updateUI();
    console.log("✅ Saved to Firebase!");
  } catch (error) {
    console.error("❌ Save error:", error);
    alert("Failed to save to cloud. See console.");
  }
}

// Load from Firestore
async function loadFromCloud() {
  try {
    const doc = await db.collection("documents").doc("main").get();
    if (doc.exists) {
      const { undoStack: loadedUndo, redoStack: loadedRedo } = doc.data();
      undoStack.splice(0, undoStack.length, ...loadedUndo);
      redoStack.splice(0, redoStack.length, ...loadedRedo);
      lastSaveTime = new Date();
      updateUI();
      console.log("✅ Loaded from Firebase!");
    }
  } catch (error) {
    console.error("❌ Load error:", error);
    alert("Failed to load from cloud.");
  }
}

function addAction() {
  const action = newActionInput.value.trim();
  if (!action) {
    newActionInput.reportValidity();
    return;
  }
  // Enqueue at the end (newest at the back) — FIFO queue behavior.
  undoStack.push(action);
  redoStack.length = 0;
  newActionInput.value = "";
  saveToCloud();
  updateUI();
}

function undoAction() {
  if (undoStack.length === 0) return;
  // FIFO undo: remove from the front of the queue and push to redo.
  const item = undoStack.shift();
  redoStack.push(item);
  saveToCloud();
  updateUI();
}

function redoAction() {
  if (redoStack.length === 0) return;
  // FIFO redo: remove from the front of redo queue and re-enqueue to undo.
  const item = redoStack.shift();
  undoStack.push(item);
  saveToCloud();
  updateUI();
}

function clearAll() {
  if (confirm("Clear all actions? This cannot be undone.")) {
    undoStack.length = 0;
    redoStack.length = 0;
    saveToCloud();
  }
}
//  Event Listeners
addBtn.addEventListener("click", addAction);
clearBtn.addEventListener("click", clearAll);
undoBtn.addEventListener("click", undoAction);
redoBtn.addEventListener("click", redoAction);
newActionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addAction();
});

// Set header to indicate FIFO behavior
const stackTitles = document.querySelectorAll(".stack-title");
if (stackTitles && stackTitles.length > 0) {
  stackTitles[0].textContent = "Actions (queue front first)";
}

//  Initialize
loadFromCloud();
updateUI();
