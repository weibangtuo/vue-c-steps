<template>
  <div class="step-item">
    <h1>Submit Summary</h1>
    <article>
      {{ summary }}
    </article>
  </div>
</template>

<script>
export default {
  data () {
    return {
      summary: ''
    }
  },
  methods: {
    handleShow (commonData) {
      this.summary = JSON.stringify(commonData)
    }
  }
}
</script>
