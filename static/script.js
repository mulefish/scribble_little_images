const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 10;
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
    e.preventDefault();

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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                loadGallery();  // Refresh gallery after saving
            } else {
                console.error('Failed to save the image');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

document.getElementById('clearButton').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function loadGallery() {
    fetch('/get_images')  // Endpoint that returns image data as JSON
        .then(response => response.json())
        .then(images => {


            const width = 6

            let table = "<table border='1'>";
            images.forEach((image, i) => {  
                // Start a new row every 4 images
                if (i % width === 0) {
                    table += "<tr>";
                }

                table += `<td><img width="152" src="/static/images/${image.filename}" /><hr/>${image.title}</td>`;

                // Close the row after 4 images
                if (i % width === width - 1 ) {
                    table += "</tr>";
                }
            });

            // Close the last row if it’s not closed
            if (images.length % width !== 0) {
                table += "</tr>";
            }

            table += "</table>";
            document.getElementById("imageGallery").innerHTML = table;
        })
        .catch(error => {
            console.error('Error loading gallery:', error);
        });
}


// Initial load of the gallery
loadGallery();
