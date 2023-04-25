<template>
  <div
    v-hammer:pan="onPanMove"
    v-hammer:panend="onPanEnd"
    v-hammer:panstart="onPanStart"
    class="base-zoom"
    :class="mainClasses"
    :style="mainStyles"
    @mousedown="onMouseDown"
    @scroll="onScroll"
  >
    <div
      ref="inner"
      class="base-zoom__inner"
    >
      <slot/>
    </div>
  </div>

</template>

<script>
import getScrollbarHeight from "@/utils/getScrollbarHeight";
import getScrollbarWidth from "@/utils/getScrollbarWidth";
import clickedOnScrollbar from "@/utils/clickedOnScrollbar";
const initialState = () => ({
  isPan: false,
  scrollY: 0,
  lastScrollY: 0,
  scrollX: 0,
  lastScrollX: 0,
  oldWidth: 0,
  oldHeight: 0,
  width: 0,
  height: 0,
  initWidth: 0,
  initHeight: 0,
  scrollbarWidth: 0,
  scrollbarHeight: 0
})
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    aspectRatio: {
      type: String,
      default: '16:9'
    },
    disableAspectRatio: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data: initialState,
  computed: {
    zoom: {
      get() {
        return this.modelValue
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue)
      }
    },
    mainStyles () {
      return {
        'aspect-ratio': this.aspectRatio
      }
    },
    mainClasses () {
      return {
        'base-zoom--no-aspect-ratio': this.disableAspectRatio
      }
    },
    isPositiveZoom () {
      return this.zoom >= 1
    }
  },
  watch: {
    zoom () {
      if (this.isPositiveZoom) {
        this.calcSize()
        this.$nextTick(() => {
          this.calcScrollbarWidth()
          this.calcScrollbarHeight()
          this.focus()
        })
      }
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    onPanStart (e) {
      if (!clickedOnScrollbar(e)) {
        this.isPan = true
      }
    },
    onMouseDown () {
      this.isPan = true
    },
    onScroll (e) {
      if (!this.isPan) {
        this.scrollY = e.target.scrollTop
        this.scrollX = e.target.scrollLeft
        this.lastScrollY = e.target.scrollTop
        this.lastScrollX = e.target.scrollLeft
      }
    },
    calcScrollbarWidth () {
      this.scrollbarWidth = getScrollbarWidth(this.$el)
    },
    calcScrollbarHeight () {
      this.scrollbarHeight = getScrollbarHeight(this.$el)
    },
    focus () {
      this.scrollX = (this.width * this.lastScrollX)/this.oldWidth
      this.scrollY = (this.height * this.lastScrollY)/this.oldHeight
      this.lastScrollY = this.scrollY
      this.lastScrollX = this.scrollX
      this.$el.scrollTo(this.scrollX, this.scrollY);
    },
    reset () {
      this.zoom = 1
      this.setSize(`100%`, `auto`)
      Object.assign(this.$data, initialState())
      this.oldWidth = this.$el.scrollWidth
      this.oldHeight = this.$el.scrollHeight
      this.width = this.$el.scrollWidth
      this.height = this.$el.scrollHeight
      this.initWidth = this.$el.scrollWidth
      this.initHeight = this.$el.scrollHeight
      this.calcScrollbarWidth()
      this.calcScrollbarHeight()
      this.$el.scrollTo(0, 0)
    },
    setSize (width, height) {
      this.$refs.inner.style.width = width
      this.$refs.inner.style.height = height
    },
    onPanMove (e) {
      if (this.isPan) {
        const maxScrollY = this.$refs.inner.clientHeight - this.$el.clientHeight
        const maxScrollX = this.$refs.inner.clientWidth - this.$el.clientWidth
        this.scrollY = this.lastScrollY - e.deltaY
        this.scrollX = this.lastScrollX - e.deltaX
        if (this.scrollY < 0) {
          this.scrollY = 0
        }
        if (this.scrollY > maxScrollY) {
          this.scrollY = maxScrollY
        }
        if (this.scrollX < 0) {
          this.scrollX = 0
        }
        if (this.scrollX > maxScrollX) {
          this.scrollX = maxScrollX
        }
        this.$el.scrollTo(this.scrollX, this.scrollY)
      }
    },
    setLastScrollX () {
      const maxScrollX = this.$refs.inner.clientWidth - this.$el.clientWidth
      this.lastScrollX = this.scrollX < maxScrollX ? this.scrollX : maxScrollX
    },
    setLastScrollY () {
      const maxScrollY = this.$refs.inner.clientHeight - this.$el.clientHeight
      this.lastScrollY = this.scrollY < maxScrollY ? this.scrollY : maxScrollY
    },
    onPanEnd () {
      this.isPan = false
      this.setLastScrollY()
      this.setLastScrollX()
    },
    calcSize () {
      this.oldWidth = this.width
      this.oldHeight = this.height
      this.width = this.initWidth * this.zoom
      this.height = this.initHeight * this.zoom
      this.setSize(
        `${this.width - this.scrollbarWidth}px`,
        `${this.height - this.scrollbarHeight}px`
      )
    }
  }
};
</script>
<style>
.base-zoom {
  overflow: auto;
  position: relative;
  width: 100%;
  cursor: grab;
}
.base-zoom__inner {
  min-width: 100%;
}
.base-zoom--no-aspect-ratio {
  aspect-ratio: unset !important;
}
</style>
