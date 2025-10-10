const cursor = document.getElementById("cursor");
console.log(cursor);


const moveCursor = (e) => {
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    
    // Get the cursor type 
    const cursorType = window.getComputedStyle(elementUnderCursor).cursor;
    cursor.style.display = "block";
    if(cursorType == "pointer") {
        cursor.style.display = "none";
    }

    console.log(e.target.style);
    const mouseY = e.clientY;
    const mouseX = e.clientX;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
}

document.addEventListener("mousemove", moveCursor);

