let mouseX = 0, mouseY = 0;
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

    // Get the cursor type 
    const cursorType = window.getComputedStyle(elementUnderCursor).cursor;
    cursor.style.display = "block";
    if(cursorType == "pointer") {
        cursor.style.display = "none";
    }
});

function animate() {
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    requestAnimationFrame(animate);
}

animate();

