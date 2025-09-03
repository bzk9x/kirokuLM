document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    const sidebar = document.querySelector('.sidebar');
    const splitter = document.querySelector('.splitter');
    let isDragging = false;
    let startX, startWidth;

    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
        sidebar.style.width = savedWidth + 'px';
        sidebar.style.flex = 'none';
    }

    function startDragging(e) {
        isDragging = true;
        startX = e.pageX;
        startWidth = sidebar.offsetWidth;
        
        main.classList.add('dragging');
        splitter.classList.add('dragging');
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    }

    function stopDragging() {
        if (!isDragging) return;
        
        isDragging = false;
        main.classList.remove('dragging');
        splitter.classList.remove('dragging');
        
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }

    function resize(e) {
        if (!isDragging) return;

        const width = startWidth + (e.pageX - startX);
        
        const minWidth = 200;
        const maxWidth = main.offsetWidth * 0.5;
        
        const newWidth = Math.min(Math.max(width, minWidth), maxWidth);
        sidebar.style.width = newWidth + 'px';
        sidebar.style.flex = 'none';
        
        localStorage.setItem('sidebarWidth', newWidth);
    }

    splitter.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopDragging);
    
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        resize({ pageX: touch.pageX });
    });
    
    document.addEventListener('touchend', stopDragging);

    splitter.addEventListener('dblclick', () => {
        sidebar.style.width = '';
        sidebar.style.flex = '2';
        localStorage.removeItem('sidebarWidth');
    });
});
