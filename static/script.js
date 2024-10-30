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

// Fetch and display the image gallery
function loadGallery() {
    fetch('/get_images')  // Endpoint that returns image data as JSON
        .then(response => response.json())
        .then(images => {
            const gallery = document.getElementById('imageGallery');
            gallery.innerHTML = '';  // Clear any existing gallery content

            let table = document.createElement('table');
            let row;
            let width = 8
            images.forEach((image, index) => {
                // Start a new row every 4 images
                if (index % width === 0) {
                    row = document.createElement('tr');
                    table.appendChild(row);
                }

                let cell = document.createElement('td');
                let img = document.createElement('img');
                img.src = `/static/images/${image.filename}`;
                img.alt = image.title;
                img.width = 128;
                img.height = 128;

                let caption = document.createElement('p');
                caption.innerText = image.title;

                cell.appendChild(img);
                cell.appendChild(caption);
                row.appendChild(cell);
            });

            gallery.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading gallery:', error);
        });
}

// Initial load of the gallery
loadGallery();
