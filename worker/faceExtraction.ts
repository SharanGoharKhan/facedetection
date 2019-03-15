import * as faceapi from 'face-api.js';
const fs = require("fs");
const { createCanvas, loadImage } = require('canvas')
import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';
import { resizeResults } from 'face-api.js';

async function run(image = './images/eqav8391.jpg') {

  await faceDetectionNet.loadFromDisk('./weights')
  const img = await canvas.loadImage(image)
  const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)
  const detectionsForSize = detections.map(det => det.forSize(img.width, img.height))
  const canvas2 = createCanvas(img.width, img.height)
  const ctx = canvas2.getContext('2d');
  ctx.drawImage(img, 0, 0)
  faceapi.drawDetection(canvas2, detectionsForSize, { withScore: true });
  const faceImages = await faceapi.extractFaces(img, detections);
  let images = await createDetectedImages(faceImages); return images
  console.log('done, saved results to examples/public/pictures.jpg', images)
  return images
}

function printFile(stream, folder, filename) {
  return new Promise(resolve => {
    const folderName = __dirname + '/../public/pictures/' + folder;
    fs.mkdir(folderName, () => {
      const filePath = filename + '.png';
      const out = fs.createWriteStream(folderName + '/' + filePath)
      stream.pipe(out)
      out.on('finish', () => {
        let returnPath = '/pictures/' + folder + "/" + filePath;
        resolve(returnPath);
      });
    })


  });
}
async function createDetectedImages(faceImages) {
  let i = 0;
  let images = [];
  const result = await faceImages.map(async face => {
    const stream = face.createPNGStream();
    i++;
    let name = makeid();
    const response = await printFile(stream, "images", name + i);
    images.push(response);
  });
  await Promise.all(result)
  return images
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports.run = run