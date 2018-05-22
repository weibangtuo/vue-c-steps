<template>
  <div class="vue-steps">
    <div class="steps-nav">
      <ul class="level-0" :style="{height: navHeight}">
        <li class="step-nav-item" v-for="item in steps"
            :class="{active: item._active, visited: item._visited}"
            :key="item.id" v-if="!item.disabled">
          <div @click="onNavClick(item, $event)">
            <span class="identifier">{{ getIdentifier(item) }}</span>
            <span class="nav-title">{{ item.title }}</span>
          </div>
          <ul class="level-1" v-if="item.children && item.children.length" v-show="item._open">
            <li class="step-nav-item" v-for="subItem in item.children"
                :class="{active: subItem._active, visited: subItem._visited}"
                :key="subItem.id">
              <div @click="onNavClick(subItem, $event)">
                <div v-if="showSubIdentProgress" class="s-progress"></div>
                <div v-if="showSubIdentifier" class="identifier">{{ getIdentifier(subItem) }}</div>
                <div class="nav-title">{{ subItem.title }}</div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="steps-content" :style="{height: contentHeight}" ref="content">
      <div class="steps-content-wrap" :style="{height: contentWrapHeight}">
        <div class="step-item-content" v-for="item in steps" :key="item.id">
          <div v-if="item.children && item.children.length">
            <component v-for="child in item.children" :key="child.id"
              v-if="child._initialized"
              v-show="child._active"
              :ref="child.id" :is="child.component"></component>
          </div>
          <div v-else>
            <component v-if="item._initialized"
              v-show="item._active"
              :ref="item.id" :is="item.component"></component>
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="btn btn-default" :disabled="!hasPrevStep" type="button" @click="handlePrev">
          {{ prevText }}
        </button>
        <button class="btn btn-primary" :disabled="loading" v-show="hasNextStep" type="button" @click="handleNext">
          {{ loading ? loadingText : nextText }}
        </button>
        <button class="btn btn-success" :disabled="loading" v-show="!hasNextStep" type="button" @click="handleSubmit" >
          {{ loading ? loadingText : submitText }}
        </button>
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Steps',
  props: {
    showSubIdentifier: {
      type: Boolean,
      default: false
    },
    showSubIdentProgress: {
      type: Boolean,
      default: true
    },
    showIdentifier: {
      type: Boolean,
      default: true
    },
    steps: {
      type: Array,
      validator (value) {
        if (!value || !value.length) {
          return false
        }
        return true
      }
    },
    heightOffset: {
      type: Number,
      default: 0
    },
    prevText: {
      type: String,
      default: 'Prev'
    },
    nextText: {
      type: String,
      default: 'Next'
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    loadingText: {
      type: String,
      default: 'Loading'
    }
  },
  data () {
    return {
      commonData: {},
      currentItem: null,
      windowHeight: window.innerHeight,
      loading: false
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleWindowResize)
    this.handleNext()
  },
  computed: {
    navHeight () {
      return this.windowHeight + this.heightOffset + 'px'
    },
    contentHeight () {
      return this.windowHeight + this.heightOffset + 'px'
    },
    contentWrapHeight () {
      return this.windowHeight + this.heightOffset - 66 + 'px'
    },
    buttonsTop () {
      const scrollTop = this.$refs.content && this.$refs.content.scrollTop || 0
      return scrollTop + this.windowHeight - 100 + 'px'
    },
    hasPrevStep() {
      return !!this.getPrev(this.currentItem)
    },
    hasNextStep () {
      return !!this.getNext(this.currentItem)
    }
  },
  methods: {
    onNavClick(step, event) {
      event.preventDefault()
      if (step.children && step.children.length) {
        step._open = !step._open
        return
      }
      if (step === this.currentItem) {
        return
      }
      if (this.compareStepIndex(step, this.currentItem) > 0) {
        this.handleNext()
      } else {
        this.goStepWithoutValidate(step)
        this.$emit('prev', step)
      }
    },
    getStepIndex(step) {
      if (!step) {
        return [-1, -1]
      }
      let subIndex = -1
      const index = this.steps.findIndex(x => {
        if (x === step) {
          return true
        }
        subIndex = x.children.indexOf(step)
        return subIndex !== -1
      })
      return [index, subIndex]
    },
    getIdentifier (step) {
      if (!step) {
        return ''
      }
      let stepIndex = 0
      let subStepIndex = 0
      let ret = this.steps.some(item => {
        subStepIndex = 0
        if (item.disabled) {
          return false
        }
        stepIndex ++
        if (item === step) {
          return true
        }
        if (item.children && item.children.length) {
          return item.children.some(x => {
            if (x.disabled) {
              return false
            }
            subStepIndex ++
            return x === step
          })
        }
      })
      if (ret) {
        return stepIndex + (subStepIndex ? `.${subStepIndex}` : '')
      }
      return ''
    },
    getNext (step) {
      const index = this.getStepIndex(step)
      for (let i = index[0]; i < this.steps.length; i++) {
        const item = this.steps[i]
        if (!item || item.disabled) {
          continue
        }
        if (item === step) {
          if (!item.children || !item.children.length) {
            continue
          }
          const sub =  item.children.find(x => !x.disabled)
          if (!sub) {
            continue
          }
          return sub
        }
        if (item.children && item.children.length) {
          const subIndex = item.children.indexOf(step)
          const sub =  item.children.find((x, i) => {
            return i > subIndex && !x.disabled
          })
          if (!sub) {
            continue
          }
          return sub
        }
        return item
      }
      return null
    },
    getPrev (step) {
      const index = this.getStepIndex(step)
      if (index[0] === -1 || index[0] === 0 && index[1] === 0) {
        return null
      }
      for (let i = index[0]; i >= 0; i--) {
        const item = this.steps[i]
        if (!item || item.disabled || item === step) {
          continue
        }
        if (item.children && item.children.length) {
          const subIndex = item.children.indexOf(step)
          let j = subIndex === -1 ? item.children.length - 1 : subIndex - 1
          for (; j >= 0; j--) {
            const sub = item.children[j]
            if (!sub.disabled) {
              return sub
            }
          }
          continue
        }
        return item
      }
      return null
    },
    markVisited (step) {
      let bound = false
      this.steps.forEach(item => {
        if (item === step) {
          item._visited = false
          item._active = true
          bound = true
        } else if (item.children && item.children.length) {
          let has = false
          item.children.forEach(child => {
            if (child == step) {
              child._visited = false
              child._active = true
              bound = true
              has = true
            } else {
              child._visited = !bound
              child._active = false
            }
          })
          item._visited = !bound && !has
          item._active = has
          item._open = has
        } else {
          item._visited = !bound
          item._active = false
        }
      })
    },
    validateCurrentStep() {
      return new Promise((resolve, reject) => {
        if (this.currentItem) {
          const ref = this.$refs[this.currentItem.id][0]
          if (ref && ref.handleValidate) {
            const ret = ref.handleValidate(this.commonData, this)
            if (ret === false) {
              reject()
              return
            }
            if (ret.constructor === window.Promise) {
              this.loading = true
              ret.then(() => {
                this.loading = false
                resolve()
              }, () => {
                this.loading = false
                reject()
              })
              return
            }
          }
        }
        resolve()
      })
    },
    handleNext () {
      this.validateCurrentStep().then(() => {
        if (this.hasNextStep) {
          const next = this.getNext(this.currentItem)
          this.goStepWithoutValidate(next)
          this.$emit('next', next)
        }
      })
    },
    compareStepIndex (a, b) {
      if (a === b) {
        return 0
      }
      if (!a) {
        return -1
      }
      if (!b) {
        return 1
      }
      const aIndex = this.getStepIndex(a)
      const bIndex = this.getStepIndex(b)
      if (aIndex[0] === bIndex[0]) {
        return aIndex[1] - bIndex[1]
      }
      return aIndex[0] - bIndex[0]
    },
    goStepWithoutValidate(step) {
      if (step) {
        if (step.children && step.children.length) {
          this.goStepWithoutValidate(this.getNext(step))
          return
        }
        if (!step._initialized) {
          step._initialized = true
        }
        if (this.currentItem === step) {
          return
        }
        const isFromPrev = this.compareStepIndex(step, this.currentItem) > 0
        this.currentItem = step
        this.markVisited(step)
        this.$nextTick(() => {
          this.$emit('showStep', step)
          const ref = this.$refs[step.id][0]
          if (ref && ref.handleShow) {
            ref.handleShow(this.commonData, isFromPrev, this)
          }
        })
      }
    },
    handlePrev () {
      const prev = this.getPrev(this.currentItem)
      this.goStepWithoutValidate(prev)
      this.$emit('prev', prev)
    },
    handleSubmit () {
      if (this.hasNextStep) {
        return
      }
      this.validateCurrentStep().then(() => {
        this.$emit('submit', this.commonData)
      })
    },
    handleWindowResize() {
      this.windowHeight = window.innerHeight
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleWindowResize)
  }
}
</script>
