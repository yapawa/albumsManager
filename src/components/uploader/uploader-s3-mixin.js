function getFn (prop) {
  return typeof prop === 'function'
    ? prop
    : () => prop
}

import * as S3 from 'aws-sdk/clients/s3'

export default {
  props: {
    s3Key: [Function, String],
    bucket: String,
    region: String,
    credentials: Object,
    metadata: [Function, Array],
    useAccelerateEndpoint: Boolean,
    options: Object,
    maxConcurrentUploads: Number
  },
  data () {
    return {
      s3Uploaders: [],
      promises: [],
      workingThreads: 0
    }
  },
  computed: {
    S3Props () {
      return {
        s3Key: getFn(this.s3Key),
        metadata: getFn(this.metadata)
      }
    },

    isUploading () {
      return this.workingThreads > 0
    },

    isBusy () {
      return this.promises.length > 0
    }
  },

  methods: {
    abort () {
      this.s3Uploaders.forEach(x => { x.abort() })

      if (this.promises.length > 0) {
        this.abortPromises = true
      }
    },
    upload () {
      if (this.canUpload === false) {
        return
      }

      const queue = this.queuedFiles.slice(0)
      this.queuedFiles = []

      const maxConcurrentUploads = parseInt(this.maxConcurrentUploads) || -1
      if (maxConcurrentUploads <= 0) {
        queue.forEach(file => {
          this.__uploadFile(file)
        })
      } else {
        const tasks = []
        queue.forEach(file => {
          tasks.push(() => this.__uploadFile(file))
        })
        this.__tasksConcurrent(maxConcurrentUploads)(tasks)
      }
    },
    __tasksConcurrent (n) {
      return list => this.__taskStepN(n, list)
    },
    __taskStepN (n, list) {
      const tail = list.splice(n)
      const head = list
      const resolved = []
      let processed = 0
      return new Promise(resolve => {
        head.forEach(x => {
          const res = x()
          resolved.push(res)
          res.then(y => {
            runNext()
            return y
          })
        })
        function runNext () {
          if (processed === tail.length) {
            resolve(Promise.all(resolved))
          } else {
            resolved.push(tail[processed]().then(x => {
              runNext()
              return x
            }))
            processed++
          }
        }
      })
    },
    __uploadFile (file) {
      this.workingThreads++
      const getProp = (name, arg) => {
        return this.S3Props[name](arg)
      }

      const s3Key = getProp('s3Key', file)

      if (!s3Key) {
        this.$Logger.error('q-uploader: invalid or no Key specified')
        this.workingThreads--
        return
      }

      let
        uploadIndexSize = 0,
        uploadedSize = 0,
        maxUploadSize = 0,
        aborted

      const s3 = new S3({
        region: this.region,
        credentials: this.credentials,
        useAccelerateEndpoint: this.useAccelerateEndpoint
      })

      const s3Params = {
        Bucket: this.bucket,
        Key: s3Key,
        Body: file,
        ContentType: file.type,
        Metadata: getProp('metadata', file)
      }
      const s3Uploader = s3.upload(s3Params, this.options)

      s3Uploader.on('httpUploadProgress', e => {
        if (aborted === true) { return }

        const loaded = Math.min(maxUploadSize, e.loaded)

        this.uploadedSize += loaded - uploadedSize
        uploadedSize = loaded

        let size = uploadedSize - uploadIndexSize
        const uploaded = size > file.size

        if (uploaded) {
          size -= file.size
          uploadIndexSize += file.size
          this.__updateFile(file, 'uploading', file.size)
        } else {
          this.__updateFile(file, 'uploading', size)
        }
      })

      this.__updateFile(file, 'uploading', 0)
      file.s3Uploader = s3Uploader
      file.__abort = s3Uploader.abort
      maxUploadSize += file.size

      this.$emit('uploading', { file, s3Uploader })
      this.s3Uploaders.push(s3Uploader)

      return s3Uploader.promise().then(data => {
        this.uploadedFiles = this.uploadedFiles.concat(file)
        this.__updateFile(file, 'uploaded')
        this.$emit('uploaded', { file, s3Uploader })
        this.workingThreads--
        this.s3Uploaders = this.s3Uploaders.filter(x => x !== s3Uploader)
        if (file.__meta) {
          const s3PutParams = {
            Bucket: this.bucket,
            Key: `${s3Key}.exif`,
            Body: JSON.stringify(file.__meta, null, 2),
            ContentType: 'application/json'
          }

          s3.putObject(s3PutParams).promise()
        }
      })
    }
  }
}
