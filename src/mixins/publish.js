import * as EventBridge from 'aws-sdk/clients/eventbridge'

export default {
  data () {
    return {
      credentials: null
    }
  },
  methods: {
    publish () {
      console.log(this.$Amplify.default._config)

      return this.$Amplify.Auth.currentCredentials()
        .then(credentials => {
          const detail = {
            aws_user_pools_web_client_id: this.$Amplify.default._config.aws_user_pools_web_client_id
          }
          const params = {
            Entries: [
              {
                EventBusName: 'default',
                Detail: JSON.stringify(detail),
                DetailType: 'user publish',
                Resources: [],
                Source: 'yapawa',
                Time: new Date()
              }
            ]
          }
          const eventbridge = new EventBridge({
            region: this.$Amplify.default._config.aws_project_region,
            credentials: credentials
          })
          return eventbridge.putEvents(params).promise().then(res => {
            if (res.FailedEntryCount === 0) {
              this.lastPublish = true
            }
            return true
          })
        })
    }
  },
  computed: {
    lastPublish: {
      get () {
        return this.$store.state.ui.lastPublish
      },
      set () {
        this.$store.commit('ui/lastPublish')
      }
    }
  }
}
