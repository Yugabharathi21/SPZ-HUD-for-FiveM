let editMode = false;
let originalPositions = {};

window.addEventListener('message', function(event) {
    if (event.data.action === 'editMode') {
        editMode = event.data.toggle;
        if (editMode) {
            // Store original positions and enable dragging
            $('.draggable').each(function() {
                const id = $(this).attr('id');
                originalPositions[id] = {
                    left: $(this).css('left'),
                    top: $(this).css('top')
                };
            }).draggable('enable').css('cursor', 'move')
              .append('<div class="edit-overlay">Drag to move</div>');
        } else {
            // Disable dragging and cleanup
            $('.draggable').draggable('disable')
                          .css('cursor', 'default');
            $('.edit-overlay').remove();
        }
    } else if (event.data.action === 'saveEditMode') {
        // Save positions
        const positions = {};
        $('.draggable').each(function() {
            const id = $(this).attr('id');
            positions[id] = {
                left: $(this).css('left'),
                top: $(this).css('top')
            };
        });
        
        $.post('https://qbx_hud/saveHudPositions', JSON.stringify(positions));
        
        // Cleanup
        $('.draggable').draggable('disable')
                      .css('cursor', 'default');
        $('.edit-overlay').remove();
    } else if (event.data.action === 'cancelEditMode') {
        // Restore original positions
        Object.entries(originalPositions).forEach(([id, pos]) => {
            $(`#${id}`).css(pos);
        });
        
        // Cleanup
        $('.draggable').draggable('disable')
                      .css('cursor', 'default');
        $('.edit-overlay').remove();
    }
});

// Initialize draggable elements
$(document).ready(function() {
    $('.draggable').draggable({
        disabled: true,
        containment: "window"
    });
});