window.onload = function() {
    setTimeout(takeScreenshot, 1000); // take a screenshot after 2 seconds
}

function takeScreenshot() {
  let gameScreen = document.querySelector('.game-screen');

  // Create two new canvas elements
  let canvasBg = document.createElement('canvas');
  let canvasChar = document.createElement('canvas');

  let ctxBg = canvasBg.getContext('2d');
  let ctxChar = canvasChar.getContext('2d');

  // Get the background and expression images
  let bgImage = new Image();
  bgImage.src = getComputedStyle(gameScreen, '::before').backgroundImage.slice(5, -2);

  let charImage = new Image();
  charImage.src = getComputedStyle(gameScreen.querySelector('.character')).backgroundImage.slice(5, -2);

  // When both images are loaded...
  Promise.all([
    new Promise((resolve) => { bgImage.onload = resolve; }),
    new Promise((resolve) => { charImage.onload = resolve; }),
  ]).then(() => {
    // Draw each image onto its respective canvas
    [canvasBg, canvasChar].forEach(canvas => {
      canvas.width = gameScreen.offsetWidth;
      canvas.height = gameScreen.offsetHeight;
    });

    ctxBg.drawImage(bgImage, 0, 0, canvasBg.width, canvasBg.height);
    ctxChar.drawImage(charImage, 0, 0, canvasChar.width, canvasChar.height);

    // Create a new canvas to combine them
    let canvasFinal = document.createElement('canvas');
    let ctxFinal = canvasFinal.getContext('2d');

    canvasFinal.width = gameScreen.offsetWidth;
    canvasFinal.height = gameScreen.offsetHeight;

    // Draw the background image, then draw the character image
    ctxFinal.drawImage(canvasBg, 0, 0);
    ctxFinal.drawImage(canvasChar, 0, 0);

    // Now you can use toDataURL() method get a base64-encoded PNG image.
    let dataUrl = canvasFinal.toDataURL();

    fetch('/uploadImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imgData: dataUrl })
    }).then(res => res.json()).then(data => console.log(data));
  });
}