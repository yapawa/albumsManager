import Vue from 'vue'

import YUploaderBase from './YUploaderBase.js'
import UploaderS3Mixin from './uploader-s3-mixin.js'

export default Vue.extend({
  name: 'YUploader',
  mixins: [YUploaderBase, UploaderS3Mixin]
})
