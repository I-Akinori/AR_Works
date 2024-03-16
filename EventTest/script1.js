document.addEventListener('DOMContentLoaded', () => {
    const sceneEl = document.querySelector('#objForMarker1');

    const boxEl = document.createElement('a-box');
    boxEl.setAttribute('position', '0 0 -5');
    boxEl.setAttribute('rotation', '0 45 45');
    boxEl.setAttribute('color', '#4CC3D9');

    boxEl.addEventListener('touchstart', function () {
        const newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        console.log('tourched');
        boxEl.setAttribute('color', newColor);
    });

    sceneEl.appendChild(boxEl);
});