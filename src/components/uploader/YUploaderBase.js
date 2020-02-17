import Vue from 'vue'

import { QUploaderBase } from 'quasar/src/components/uploader'
import QBtn from 'quasar/src/components/btn/QBtn.js'
import QIcon from 'quasar/src/components/icon/QIcon.js'
import QSpinner from 'quasar/src/components/spinner/QSpinner.js'
import QTooltip from 'quasar/src/components/tooltip/QTooltip.js'
import QLinearProgress from 'quasar/src/components/linear-progress/QLinearProgress.js'
import QBadge from 'quasar/src/components/badge/QBadge.js'
import QImg from 'quasar/src/components/img/QImg.js'
import QCard from 'quasar/src/components/card/QCard.js'
import LoadImage from 'blueimp-load-image/js'

export default Vue.extend({
  name: 'YUploaderBase',

  mixins: [QUploaderBase],
  props: Object.assign({}, QUploaderBase.props, {
    color: { default: 'grey-3' },
    textColor: { default: 'grey-10' },
    dark: { default: true },
    square: { default: true },
    flat: { default: true },
    bordered: { default: true },
    multiple: { default: true },
    accept: { default: 'image/*' }
  }),
  methods: {
    __getBtn (h, show, icon, fn, tooltip, size) {
      if (show === true) {
        return h(QBtn, {
          props: {
            type: 'a',
            icon: this.$q.iconSet.uploader[icon],
            flat: true,
            dense: true,
            size: size || null
          },
          on: icon === 'add' ? null : { click: fn }
        }, [
          icon === 'add'
            ? this.__getInputControl(h)
            : null,
          tooltip
            ? h(QTooltip, tooltip)
            : null
        ])
      }
    },
    __getLinearProgress (h) {
      return h(QLinearProgress, { staticClass: 'q-mt-none', props: { value: this.uploadProgress, size: '20px', trackColor: 'grey-8' } }, [
        h('div', { staticClass: 'absolute-full flex flex-center' }, [
          h(QBadge, { props: { color: 'grey-3', textColor: 'black', label: `${this.uploadedSizeLabel} / ${this.uploadSizeLabel} (${this.uploadProgressLabel})` } })
        ])
      ])
    },
    __displayImage (h, file) {
      return h(QCard, {
        staticClass: 'col-auto',
        key: file.__id
      }, [
        h(QImg, {
          props: {
            src: file.__img.src,
            ratio: 1
          },
          style: {
            width: '120px',
            height: '120px'
          }
        }, [
          h('div', { staticClass: 'absolute-full flex flex-center transparent q-pa-none' }, [
            h(QLinearProgress, { staticClass: 'q-my-none q-mx-xs border-primary', props: { rounded: true, value: file.__progress, size: '20px', trackColor: 'grey-2' } })
          ]),
          h('div', { staticClass: 'fixed-top-right q-pa-none' }, [
            this.__getBtn(h, true, 'clear', () => this.removeFile(file), null, '10px')
          ])
        ])
      ])
    },
    __displayImages (h) {
      return [
        h('div', { staticClass: 'row q-gutter-sm' }, this.files.map(file => this.__displayImage(h, file)))
      ]
    },
    __getUploadBackground (h) {
      return [
        h('div', {
          staticClass: 'column fit justify-center items-center',
          on: {
            click: this.pickFiles
          }
        }, [
          h('div', { staticClass: 'col' }, [
            h(QIcon, { staticClass: 'self-center', props: { size: '184px', name: 'cloud_upload', color: 'grey-6' } })
          ]),
          h('div', { staticClass: 'col text-h5 text-grey-6' }, this.$t('Drop Images Here'))
        ])
      ]
    },
    __getHeader (h) {
      this.$q.iconSet.uploader.add = 'add_to_photos'
      return [
        h('div', {
          staticClass: 'q-uploader__header-content flex flex-center no-wrap q-gutter-xs q-pa-sm'
        }, [
          this.__getBtn(h, this.queuedFiles.length > 0, 'removeQueue', this.removeQueuedFiles, this.$t('Clear All')),
          this.__getBtn(h, this.uploadedFiles.length > 0, 'removeUploaded', this.removeUploadedFiles, this.$t('Remove Uploaded Files')),

          this.isUploading === true
            ? h(QSpinner, { staticClass: 'q-uploader__spinner' })
            : null,

          this.files.length > 0
            ? h('div', { staticClass: 'col q-uploader__subtitle' }, `${this.uploadedFiles.length} ${this.$t('files uploaded out of')} ${this.files.length}`)
            : h('div', { staticClass: 'col q-uploader__title' }, this.$t('Upload your files')),

          this.__getBtn(h, this.canAddFiles, 'add', this.pickFiles, this.$t('Pick Files')),
          this.__getBtn(h, this.hideUploadBtn === false && this.canUpload === true, 'upload', this.upload, this.$t('Upload Files')),
          this.__getBtn(h, this.isUploading, 'clear', this.abort, this.$t('Abort Upload'))
        ]),
        this.__getLinearProgress(h)
      ]
    },
    __getList (h) {
      return this.files.length > 0
        ? this.__displayImages(h)
        : this.__getUploadBackground(h)
    },
    __addFiles (e, fileList) {
      const files = this.__processFiles(e, fileList)
      this.__getFileInput().value = ''

      if (files === undefined) { return }

      const filesReady = [] // List of image load promises

      files.forEach(file => {
        this.__updateFile(file, 'idle')
        this.uploadSize += file.size

        if (this.noThumbnails !== true && file.type.toUpperCase().startsWith('IMAGE')) {
          const p = new Promise((resolve, reject) => {
            LoadImage(
              file,
              (img, data) => {
                file.__width = data.originalWidth
                file.__height = data.originalHeight
                file.__orientation = -1

                file.__img = {
                  src: img.toDataURL(file.type)
                }
                if (data.exif) {
                  file.__exif = data.exif.getAll()
                  file.__orientation = data.exif.get(0x0112) || -1
                  const [imageWidth, imageHeight] = file.__orientation >= 5 && file.__orientation <= 8
                    ? [file.__height, file.__width]
                    : [file.__width, file.__height]
                  file.__width = imageWidth
                  file.__height = imageHeight
                }
                resolve(true)
              },
              {
                meta: true,
                maxWidth: 600,
                maxHeight: 600,
                canvas: true,
                orientation: true
              }
            )
          })
          filesReady.push(p)
        }
      })
      Promise.all(filesReady).then(() => {
        this.files = this.files.concat(files)
        this.queuedFiles = this.queuedFiles.concat(files)
        this.$emit('added', files)
        this.autoUpload === true && this.upload()
      })
    }
  }
})
