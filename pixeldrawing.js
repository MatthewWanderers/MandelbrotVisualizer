window.onload = function() {
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;

  const imageData = context.createImageData(width, height);

  function createImage(offset) {
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        const pixelIndex = (y * width + x) * 4;

        let blue = ((x + offset) % 256) ^ ((y + offset) % 256);
        let green = ((2 * x + offset) % 256) ^ ((2 * y + offset) % 256);
        let red = ((-1 * x + offset) % 256) ^ ((y + offset) % 256);
        // let blue = 50 + Math.floor(Math.random()*100);

        // blue = (blue) % 256;

        imageData.data[pixelIndex] = red;
        imageData.data[pixelIndex + 1] = green;
        imageData.data[pixelIndex + 2] = blue;
        imageData.data[pixelIndex + 3] = 255;
      }
    }
  };

  function main(tframe) {
    window.requestAnimationFrame(main);
    createImage(Math.floor(tframe / 10));
    context.putImageData(imageData, 0, 0);
  }

  main(0);
};
