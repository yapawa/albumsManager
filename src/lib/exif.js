// import exif from 'jpeg-exif'
import * as exifr from 'exifr'

export const parseExif = (dataUri) => {
  const buf = Buffer.from(dataUri.replace(/^.*;base64,/, ''), 'base64')
  return exifr.parse(buf)
    .then(clean)
    .then(exif => {
      if (!exif) {
        return null
      }
      return exif
    })
    .catch(err => null) // eslint-disable-line handle-callback-err
}

const clean = (exif) => {
  if (!exif) {
    return null
  }
  exif.GPSDateTime = exif.timestamp
  const cleanExif = {}
  fields.forEach(f => {
    if (exif[f]) {
      if (typeof exif[f] === 'object') {
        try {
          cleanExif[f] = exif[f].toISOString()
        } catch (err) {
          cleanExif[f] = exif[f]
        }
      } else {
        cleanExif[f] = exif[f]
      }
    }
  })
  return cleanExif
}

const fields = [
  'Make',
  'Model',
  'Software',
  'Orientation',
  'ModifyDate',
  'Artist',
  'Copyright',
  'ExposureTime',
  'FNumber',
  'ExposureProgram',
  'ISO',
  'DateTimeOriginal',
  'DateTimeDigitized',
  'ShutterSpeedValue',
  'ApertureValue',
  'BrightnessValue',
  'ExposureBiasValue',
  'MaxApertureValue',
  'SubjectDistance',
  'MeteringMode',
  'LightSource',
  'Flash',
  'FocalLength',
  'SensingMethod',
  'SceneType',
  'CustomRendered',
  'ExposureMode',
  'WhiteBalance',
  'DigitalZoomRatio',
  'FocalLengthIn35mmFormat',
  'SceneCaptureType',
  'GainControl',
  'Contrast',
  'Saturation',
  'Sharpness',
  'SubjectDistanceRange',
  'BodySerialNumber',
  'LensSpecification',
  'LensModel',
  'GPSAltitude',
  'GPSDateTime',
  'latitude',
  'longitude',
  'GPSSatellites'
]
