import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin, AmplifyEventBus } from 'aws-amplify-vue'
import awsconfig from '../aws-exports'
Amplify.configure(awsconfig)

export default async ({
  router,
  Vue
}) => {
  Vue.use(AmplifyPlugin, AmplifyModules)
  Vue.prototype.$AmplifyEventBus = AmplifyEventBus
}
