const keys = {};
const step = 10;
const divs = document.querySelectorAll('.div-style');
let activeDiv = null; // Variable to track the currently active div

function updatePosition() {
    if (activeDiv) {
        let top = parseInt(window.getComputedStyle(activeDiv).getPropertyValue('top'));
        let left = parseInt(window.getComputedStyle(activeDiv).getPropertyValue('left'));
        const divWidth = activeDiv.offsetWidth;
        const divHeight = activeDiv.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (keys['w'] && top > 0) {
            top -= step;
        }
        if (keys['s'] && top < windowHeight - divHeight) {
            top += step;
        }
        if (keys['a'] && left > 0) {
            left -= step;
        }
        if (keys['d'] && left < windowWidth - divWidth) {
            left += step;
        }

        activeDiv.style.top = top + 'px';
        activeDiv.style.left = left + 'px';
    }
    requestAnimationFrame(updatePosition);
}

function isClickWithinDiv(x, y, div) {
    const rect = div.getBoundingClientRect();
    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
}

document.addEventListener('keydown', function(event) {
    keys[event.key.toLowerCase()] = true;
    if (Object.keys(keys).length === 1 && activeDiv) {
        updatePosition();
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.key.toLowerCase()] = false;
});

document.addEventListener('mousedown', function(event) {
    if (event.button === 0) {
        const { clientX, clientY } = event;
        let clickedDiv = null;

        divs.forEach(div => {
            if (isClickWithinDiv(clientX, clientY, div)) {
                clickedDiv = div;
            }
        });

        if (clickedDiv) {
            if (activeDiv !== clickedDiv) {
                if (activeDiv) {
                    activeDiv.classList.remove('moving');
                    activeDiv.classList.add('not-moving');
                }
                activeDiv = clickedDiv;
                activeDiv.classList.remove('not-moving');
                activeDiv.classList.add('moving');
            } else {
                activeDiv.classList.remove('moving');
                activeDiv.classList.add('not-moving');
                activeDiv = null;
            }
        }
    }
});

document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    // Calculate ripple size based on the size of the viewport
    const size = Math.max(window.innerWidth, window.innerHeight);

    // Set size and position of the ripple
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - size / 2}px`;
    ripple.style.top = `${e.clientY - size / 2}px`;

    // Append the ripple to the body
    document.body.appendChild(ripple);

    // Remove the ripple element after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 1200); // Duration of the ripple animation
});

const squares = [];
const squareSize = 20;
const spacing = 25; // Distance between the centers of adjacent squares
const maxDistance = 100; // Decreased distance for full visibility

function createSquares() {
    const numCols = Math.ceil(window.innerWidth / spacing);
    const numRows = Math.ceil(window.innerHeight / spacing);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.style.width = `${squareSize}px`;
            square.style.height = `${squareSize}px`;
            square.style.left = `${col * spacing}px`;
            square.style.top = `${row * spacing}px`;
            document.body.appendChild(square);
            squares.push(square);
        }
    }
}

function updateSquares(e) {
    const { clientX, clientY } = e;
    squares.forEach(square => {
        const rect = square.getBoundingClientRect();
        const distance = Math.hypot(
            clientX - (rect.left + rect.width / 2),
            clientY - (rect.top + rect.height / 2)
        );
        const scale = Math.max(1 - distance / maxDistance, 0);
        // Reduce the intensity and radius of the glow effect
        const opacity = Math.min(0.4, scale); // Decreased maximum opacity
        square.style.transform = `scale(${1 + scale * 0.3})`; // Decrease scaling effect
        square.style.opacity = opacity;
    });
}

document.addEventListener('mousemove', updateSquares);
createSquares();