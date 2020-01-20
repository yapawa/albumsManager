// Based on: https://stackoverflow.com/a/46814952/283851

export const getImageUrl = (image, maxWidth) => {
  const orientation = readOrientation(image.src)
  const src = applyRotation(image, orientation || 1, maxWidth || 99999)
  return { orientation, src }
}

const toArrayBuffer = (dataUri) => {
  const buf = Buffer.from(dataUri.replace(/^.*;base64,/, ''), 'base64')
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i]
  }
  return ab
}

const readOrientation = (dataUri) => {
  const view = new DataView(toArrayBuffer(dataUri))
  if (view.getUint16(0, false) !== 0xFFD8) {
    return
  }
  const length = view.byteLength
  let offset = 2
  while (offset < length) {
    const marker = view.getUint16(offset, false)
    offset += 2
    if (marker === 0xFFE1) {
      offset += 2
      if (view.getUint32(offset, false) !== 0x45786966) {
        return
      }
      offset += 6
      const little = view.getUint16(offset, false) === 0x4949
      offset += view.getUint32(offset + 4, little)
      const tags = view.getUint16(offset, little)
      offset += 2
      for (var i = 0; i < tags; i++) {
        if (view.getUint16(offset + (i * 12), little) === 0x0112) {
          return view.getUint16(offset + (i * 12) + 8, little)
        }
      }
    } else if ((marker & 0xFF00) !== 0xFF00) {
      break
    } else {
      offset += view.getUint16(offset, false)
    }
  }
}

/*
1 - 0 degrees – the correct orientation, no adjustment is required.
2 - 0 degrees, mirrored – image has been flipped back-to-front.
3 - 180 degrees – image is upside down.
4 - 180 degrees, mirrored – image is upside down and flipped back-to-front.
5 - 90 degrees – image is on its side.
6 - 90 degrees, mirrored – image is on its side and flipped back-to-front.
7 - 270 degrees – image is on its far side.
8 - 270 degrees, mirrored – image is on its far side and flipped back-to-front.
*/
export const applyRotation = (image, orientation, maxWidth) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  let { width, height } = image
  const [outputWidth, outputHeight] = orientation >= 5 && orientation <= 8
    ? [height, width]
    : [width, height]
  const scale = outputWidth > maxWidth ? maxWidth / outputWidth : 1
  width = width * scale
  height = height * scale
  // set proper canvas dimensions before transform & export
  canvas.width = outputWidth * scale
  canvas.height = outputHeight * scale
  // transform context before drawing image
  switch (orientation) {
  case 2:
    context.transform(-1, 0, 0, 1, width, 0)
    break
  case 3:
    context.transform(-1, 0, 0, -1, width, height)
    break
  case 4:
    context.transform(1, 0, 0, -1, 0, height)
    break
  case 5:
    context.transform(0, 1, 1, 0, 0, 0)
    break
  case 6:
    context.transform(0, 1, -1, 0, height, 0)
    break
  case 7:
    context.transform(0, -1, -1, 0, height, width)
    break
  case 8:
    context.transform(0, -1, 1, 0, 0, width)
    break
  default: break
  }
  // draw image
  context.drawImage(image, 0, 0, width, height)
  // export base64
  return canvas.toDataURL('image/jpeg')
}
