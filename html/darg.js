export default {
  data() {
    return {
      isEditMode: false,
      initialPositions: {},
      hudPositions: JSON.parse(localStorage.getItem('hudPositions')) || {},
    };
  },
  methods: {
    // New Feature Action
    newFeatureAction(event) {
      console.log("New Feature Button Clicked!");
      // Add your desired functionality here
    },

    // Make an element draggable
    makeDraggable(element) {
      let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

      const onMouseDown = (e) => {
        if (!this.isEditMode) return;
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;

        // Add event listeners for mousemove and mouseup
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
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
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      element.addEventListener("mousedown", onMouseDown);
    },

    // Enable edit mode
    enterEditMode() {
      this.isEditMode = true;
      const draggables = this.$refs.draggables || [];
      draggables.forEach((element) => {
        element.classList.add("edit-mode");
        const id = element.id;
        this.initialPositions[id] = {
          top: element.style.top,
          left: element.style.left,
        };
      });
    },

    // Save positions to localStorage
    savePositions() {
      const positions = {};
      const draggables = this.$refs.draggables || [];
      draggables.forEach((element) => {
        positions[element.id] = {
          top: element.style.top,
          left: element.style.left,
        };
      });
      localStorage.setItem("hudPositions", JSON.stringify(positions));
      this.exitEditMode();
    },

    // Cancel edit mode and reset positions
    cancelEditMode() {
      const draggables = this.$refs.draggables || [];
      draggables.forEach((element) => {
        const id = element.id;
        if (this.initialPositions[id]) {
          element.style.top = this.initialPositions[id].top;
          element.style.left = this.initialPositions[id].left;
        }
      });
      this.exitEditMode();
    },

    // Exit edit mode
    exitEditMode() {
      this.isEditMode = false;
      const draggables = this.$refs.draggables || [];
      draggables.forEach((element) => element.classList.remove("edit-mode"));
    },

    // Load saved positions from localStorage
    loadPositions() {
      const draggables = this.$refs.draggables || [];
      draggables.forEach((element) => {
        const id = element.id;
        if (this.hudPositions[id]) {
          element.style.top = this.hudPositions[id].top;
          element.style.left = this.hudPositions[id].left;
        }
      });
    },
  },
  mounted() {
    // Load positions on component mount
    this.loadPositions();
    const draggables = this.$refs.draggables || [];
  draggables.forEach((element) => this.makeDraggable(element));
  this.loadPositions();

  // Listen for Lua events
  window.addEventListener("edithud:toggle", (event) => {
    const isEditMode = event.detail;
    if (isEditMode) {
      this.enterEditMode();
    } else {
      this.exitEditMode();
    }
  });

  window.addEventListener("edithud:save", () => {
    this.savePositions();
  });

  window.addEventListener("edithud:cancel", () => {
    this.cancelEditMode();
  });
},
}
