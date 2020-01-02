import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import awsconfig from '../aws-exports'
Amplify.configure(awsconfig)

export default async ({
  router,
  Vue
}) => {
  Vue.use(AmplifyPlugin, AmplifyModules)
}
