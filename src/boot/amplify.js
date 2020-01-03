import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin, AmplifyEventBus } from 'aws-amplify-vue'
import awsconfig from '../aws-exports'
Amplify.configure(awsconfig)

import en from '../i18n/en-us'
import fr from '../i18n/fr'
import de from '../i18n/de'

const dict = {
  fr,
  en,
  de
}

Amplify.I18n.putVocabularies(dict)

export default async ({
  router,
  Vue
}) => {
  Vue.use(AmplifyPlugin, AmplifyModules)
  Vue.prototype.$AmplifyEventBus = AmplifyEventBus
}
