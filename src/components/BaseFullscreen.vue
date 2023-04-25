<template>
  <Teleport
to="body"
            :disabled="!open"
  >
    <div
class="base-fullscreen"
         :class="mainClasses"
    >
      <slot/>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    class: {
      type: [Array, Object, String]
    }
  },
  emits: ['update:modelValue'],
  computed: {
    open: {
      get () {
        return this.modelValue
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    },
    mainClasses () {
      return [this.class, {
        'base-fullscreen--open': this.open
      }]
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    onKeyDown (e) {
      const {key} = e;
      if (key === "Escape") this.open = false
    }
  }
}
</script>
<style>
.base-fullscreen--open {
    position: fixed;
    top: 0;
    left: 0;
    background-color: black;
    z-index: 99999;
    width: 100vw;
    height: 100vh;
}
</style>
