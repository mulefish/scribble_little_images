const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 10;  // Set the cursor width to 10
let drawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    const pos = getEventPosition(e);
    ctx.moveTo(pos.x, pos.y);
}

function stopDrawing() {
    drawing = false;
}

function draw(e) {
    if (!drawing) return;
    e.preventDefault();  // Prevent scrolling on touch

    const pos = getEventPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function getEventPosition(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX - canvas.offsetLeft, y: e.touches[0].clientY - canvas.offsetTop };
    } else {
        return { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
    }
}

document.getElementById('saveButton').addEventListener('click', function() {
    const filename = prompt("Please enter a filename for your drawing:", "my_drawing");
    if (filename) {
        const imageData = canvas.toDataURL('image/png');
        fetch('/save_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `imageData=${encodeURIComponent(imageData)}&filename=${encodeURIComponent(filename)}`,
        })
        .then(response => {
            if (response.ok) {
                // Clear the canvas after a successful save
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                console.error('Failed to save the image');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
