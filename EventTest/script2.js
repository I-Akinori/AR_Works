document.addEventListener('DOMContentLoaded', () => {
    const objForMarker2 = document.querySelector('#objForMarker2');
    objForMarker2.setAttribute('geometry', { primitive: 'box' });
    objForMarker2.setAttribute('material', 'color: blue');
    objForMarker2.setAttribute('position', { x: 0, y: 0.5, z: 0 });
});