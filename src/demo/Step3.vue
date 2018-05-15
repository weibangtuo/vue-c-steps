<template>
  <div class="step-item">
    <h1>Step 3</h1>
    <article>
      <form action="index.html" method="post">
        <div>
          <p>Implement <code>handleValidate</code> method in you Vue compenent methods. You can return a Boolean or Promise. </p>
        </div>
        <div>
          <label for="txt_1">Name</label>
          <input id="txt_1" type="text" v-model="name">
        </div>
        <div class="">
          <label for="txt_2">Age</label>
          <input id="txt_2" type="text" v-model="age">
        </div>
      </form>
    </article>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      age: ''
    }
  },
  methods: {
    handleShow(commonData) {
      if (commonData.name) {
        this.name = commonData.name
      }
      if (commonData.age) {
        this.age = commonData.age
      }
    },
    handleValidate(commonData) {
      // return boolean or promise
      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          if (!this.name) {
            reject()
            alert('name required')
            return
          }
          if (!this.age) {
            reject()
            alert('age required')
            return
          }
          commonData.name = this.name
          commonData.age = this.age
          resolve()
        }, 300)
      });
    }
  }
}
</script>
