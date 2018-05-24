# Vue Steps

A Vue component of steps view.

##

## Getting Started

First install vue-c-steps:

```shell
npm i vue-c-steps --save
```

* Usage

```javascript
<template>
  <div id="app">
    <Steps :steps="steps" @submit="handleSubmit"/>
  </div>
</template>
<script>
import 'vue-c-steps/public/vue-c-steps.css'
import {Steps, parseStepItem} from 'vue-c-steps'
import Step1 from './Step1'
import Step2 from './Step2'
export default {
  name: 'app',
  data () {
    return {
      steps: [
        parseStepItem({
          title: 'Vue Step 1',
          component: Step1
        }),
        parseStepItem({
          title: 'Vue Step 2',
          component: Step2
        })
      ]
    }
  },
  methods: {
    handleSubmit () {
      // do something
    }
  }
}
</script>
```

Or see demo in `src/demo`

## Document

* Step Item Properties

| Property |  type  | Required | Description |
| -------- | ------ | ------ | ------------- |
| id       | String |   N     | You can read component from `$refs` by id |
| title    | String |   Y     | Steps nav title |
| component| VueComponent| Y (N for parent item) | Component for step content |
| _active  | Boolean | readonly | Whether step item active |
| _visited | Boolean | readonly | Whether step item visited |
| _initialized | Boolean | readonly | Whether step item component initialized |
| _open    | Boolean | readonly | Whether step item open for parent item only |
| children | Array |     N    | Mark as parent step item if not empty. The children item will ignore children property. It's support level-2 only. |

Property name starting with `_` mean readonly and be controlled by `vue-c-steps`.

## Development scripts

* Build

```shell
npm run build

```

* Run demo

```shell
npm run serve

```

* lint

```shell
npm run lint

```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018
