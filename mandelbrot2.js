window.onload = function secondInit() {
  let canvas = document.getElementById("canvas1");
  let context = canvas.getContext("2d");

  let width = canvas.width;
  let height = canvas.height;

  let imageData = context.createImageData(width, height);

  let maxIterations = 10;
  let palette = [];

  let xOffset = -width / 2;
  let yOffset = -height / 2;
  let xPan = -50;
  let yPan = 0;
  let zoom = 200;

  function init() {
    canvas.addEventListener("mousedown", onMouseDown, false);
    // window.addEventListener("mouseup", onMouseUp, false);

    generatePalette();
    generateImage();
    main(0);
  }

  function main(tframe) {
    window.requestAnimationFrame(main);

    context.putImageData(imageData, 0, 0);
  }

  function generatePalette() {
    let rOffset = 18;
    let gOffset = 4;
    let bOffset = 90;
    for (var i = 0; i < 256; i++) {
      palette[i] = { r: rOffset, g: gOffset, b: bOffset };

      if (i < 45) {
        bOffset += 2;
      } else if (i < 80) {
        gOffset += 1;
        bOffset -= 2;
      } else if (i < 120) {
        gOffset += 1;
        rOffset -= 2;
      } else if (i < 192) {
        rOffset += 2;
        gOffset -= 2;
        bOffset += 1;
      } else if (i < 224) {
        rOffset += 5;

      }
    }
  }

  function generateImage() {
    for (var y = 0; y < width; y++) {
      for (var x = 0; x < height; x++) {
        iterate(x, y, maxIterations);
      }
    }
  }

  function iterate(x, y, maxIterations) {
    let x0 = (x + xOffset + xPan) / zoom;
    let y0 = (y + yOffset + yPan) / zoom;

    let a = 0;
    let b = 0;
    let rx = 0;
    let ry = 0;

    let iterations = 0;
    while (iterations < maxIterations && (rx * rx + ry * ry <= 4)) {
      rx = a * a - b * b + x0;
      ry = 2 * a * b + y0;

      a = rx;
      b = ry;
      iterations++
    }

    let color;
    if (iterations == maxIterations) {
      color = {r: 0, g: 0, b: 0};
    } else {
      const index = Math.floor(iterations / (maxIterations - 1) * 255);
      color = palette[index];
    }

    let pixelIndex = (y * width + x) * 4;
    imageData.data[pixelIndex] = color.r;
    imageData.data[pixelIndex + 1] = color.g;
    imageData.data[pixelIndex + 2] = color.b;
    imageData.data[pixelIndex + 3] = 255;
  }

  function zoomFractal(x, y, factor, zoomIn) {
    if (zoomIn) {
      zoom *= factor;
      xPan = factor * (x + xOffset + xPan);
      yPan = factor * (y + yOffset + yPan);
    } else {
      zoom /= factor;
      xPan = (x + xOffset + xPan) / factor;
      yPan = (y + yOffset + yPan) / factor;
    }
  }



  function onMouseDown(e) {
    const pos = getMousePos(canvas, e);

    let zoomIn = true;
    if (e.ctrlKey) {
      zoomIn = false;
    }

    let zoomFactor = 1.5;
    if (e.shiftKey) {
      zoomFactor = 1;
    }

    zoomFractal(pos.x, pos.y, zoomFactor, zoomIn);

    generateImage();
  }

  function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left)/(rect.right - rect.left) * canvas.width),
      y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top) * canvas.height)

    };
  }

  init();
};
