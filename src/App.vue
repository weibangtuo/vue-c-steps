<template>
  <div id="app">
    <Steps :steps="steps" @submit="handleSubmit"/>
  </div>
</template>

<script>
import Steps from './components/Steps.vue'
import parseStepItem from './components/StepItem'
import Step1 from './demo/Step1'
import Step11 from './demo/Step11'
import Step12 from './demo/Step12'
import Step13 from './demo/Step13'
import Step2 from './demo/Step2'
import Step3 from './demo/Step3'
import Step4 from './demo/Step4'
import Step5 from './demo/Step5'

export default {
  name: 'app',
  data () {
    return {
      steps: [
        parseStepItem({
          title: 'Vue Step ',
          component: Step1
        }),
        parseStepItem({
          title: 'Coffee Roasting Basics',
          children: [
            {
              title: "Keep smell in mind",
              component: Step11
            },
            {
              title: "Know that the length of your roast is based on the color of the beans",
              component: Step12
            },
            {
              title: "Listen for the crackling sound",
              component: Step13
            }
          ]
        }),
        parseStepItem({
          title: 'Using an Oven',
          component: Step2
        }),
        parseStepItem({
          title: 'Validator Form',
          component: Step3
        }),
        parseStepItem({
          title: 'This is a Long Title Text, Long Text, Long Long Text',
          component: Step4
        }),
        parseStepItem({
          title: 'Submit Summary',
          component: Step5
        })
      ]
    }
  },
  methods: {
    handleSubmit (commonData) {
      alert('handleSubmot: ', JSON.stringify(commonData))
    }
  },
  components: {
    Steps
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #000;
}
body {
  padding: 0;
  margin: 0;
}
</style>
