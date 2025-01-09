let editMode = false;
let originalPositions = {};

window.addEventListener('message', function(event) {
    if (event.data.action === 'editMode') {
        editMode = event.data.toggle;
        if (editMode) {
            // Store original positions
            $('.draggable').each(function() {
                const id = $(this).attr('id');
                originalPositions[id] = {
                    left: $(this).css('left'),
                    top: $(this).css('top')
                };
            });
            
            // Make elements draggable
            $('.draggable').draggable('enable');
            $('.draggable').css('cursor', 'move');
            
            // Show positioning helper
            $('.draggable').append('<div class="edit-overlay">Drag to move</div>');
        } else {
            // Disable dragging
            $('.draggable').draggable('disable');
            $('.draggable').css('cursor', 'default');
            
            // Remove positioning helper
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
        
        // Send positions back to Lua
        $.post('https://qbx_hud/saveHudPositions', JSON.stringify(positions));
        
        // Disable dragging
        $('.draggable').draggable('disable');
        $('.draggable').css('cursor', 'default');
        $('.edit-overlay').remove();
    } else if (event.data.action === 'cancelEditMode') {
        // Restore original positions
        for (const [id, pos] of Object.entries(originalPositions)) {
            $(`#${id}`).css(pos);
        }
        
        // Disable dragging
        $('.draggable').draggable('disable');
        $('.draggable').css('cursor', 'default');
        $('.edit-overlay').remove();
    }
});

// Initialize draggable elements (disabled by default)
$(document).ready(function() {
    $('.draggable').draggable({
        disabled: true,
        containment: "window"
    });
}); 