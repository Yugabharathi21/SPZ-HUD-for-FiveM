const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const draggables = document.querySelectorAll('.draggable');
let isEditMode = false;
let initialPositions = {};

// Function to make an element draggable
function makeDraggable(element) {
  let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

  const onMouseDown = (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;

    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;

    // Update element position
    element.style.left = `${element.offsetLeft + offsetX}px`;
    element.style.top = `${element.offsetTop + offsetY}px`;
  };

  const onMouseUp = () => {
    // Remove event listeners when mouse is released
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  element.addEventListener('mousedown', onMouseDown);
}

// Enable edit mode
function enterEditMode() {
  isEditMode = true;
  draggables.forEach((element) => {
    element.classList.add('edit-mode');
    const id = element.id;
    initialPositions[id] = { top: element.style.top, left: element.style.left };
  });
  editButton.style.display = 'none';
  saveButton.style.display = 'inline';
  cancelButton.style.display = 'inline';
}

// Save positions to localStorage
function savePositions() {
  const positions = {};
  draggables.forEach((element) => {
    positions[element.id] = {
      top: element.style.top,
      left: element.style.left,
    };
  });
  localStorage.setItem('hudPositions', JSON.stringify(positions));
  exitEditMode();
}

// Cancel edit mode and reset positions
function cancelEditMode() {
  draggables.forEach((element) => {
    const id = element.id;
    element.style.top = initialPositions[id].top;
    element.style.left = initialPositions[id].left;
  });
  exitEditMode();
}

// Exit edit mode
function exitEditMode() {
  isEditMode = false;
  draggables.forEach((element) => element.classList.remove('edit-mode'));
  editButton.style.display = 'inline';
  saveButton.style.display = 'none';
  cancelButton.style.display = 'none';
}

// Load saved positions from localStorage
function loadPositions() {
  const savedPositions = JSON.parse(localStorage.getItem('hudPositions')) || {};
  draggables.forEach((element) => {
    const id = element.id;
    if (savedPositions[id]) {
      element.style.top = savedPositions[id].top;
      element.style.left = savedPositions[id].left;
    }
  });
}

// Initialize draggable elements
draggables.forEach((element) => makeDraggable(element));

// Event Listeners
editButton.addEventListener('click', enterEditMode);
saveButton.addEventListener('click', savePositions);
cancelButton.addEventListener('click', cancelEditMode);

// Load positions on page load
loadPositions();
