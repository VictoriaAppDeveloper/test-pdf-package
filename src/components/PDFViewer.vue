<template>
  <fullscreen
              v-model="fullscreen"
              class="pdf-viewer"
              :class="mainClasses"
              teleport

  >
    <div class="pdf-viewer__actions">
      <button class="primary" @click="currentPage = currentPage > 1 ? currentPage - 1 : 1">Prev</button>
      <div>{{ currentPage }} / {{ pages }}</div>
      <button class="primary" @click="currentPage = currentPage < pages ? currentPage + 1 : pages">Next</button>
      <button class="primary" @click="fullscreen = !fullscreen">fullscreen</button>
    </div>
    <div class="pdf-viewer__content">
      <div  ref="wrapper"  class="pdf-viewer__wrapper">
        <VuePDF class="pdf-viewer__pdf" :pdf="pdf" :page="currentPage" :scale="scale"/>
      </div>
    </div>
  </fullscreen>
</template>

<script>
import { usePDF, VuePDF } from "@tato30/vue-pdf";
import url from '@/assets/files/mexanicna_filtraciya_01_de.pdf'
import { component } from 'vue-fullscreen'
import PinchZoom from "pinch-zoom-js";
export default {
  components: {
    VuePDF,
    fullscreen: component,
  },
  setup() {
    const { pdf, pages } = usePDF(url);

    return {
      pdf,
      pages,
    };
  },
  data: () => ({
    scale: 5,
    currentPage: 1,
    fullscreen: false,
    pinchZoom: null
  }),
  computed: {
    mainClasses () {
      return {
        'pdf-viewer--fullscreen': this.fullscreen
      }
    },
  },
  watch: {
    fullscreen (newValue) {
      if (newValue) {
        this.pinchZoom.enable()
      } else {
        this.pinchZoom.zoomFactor = 1
        this.pinchZoom.disable()
      }
    }
  },
  mounted() {
    this.pinchZoom = new PinchZoom(this.$refs.wrapper, {})
    console.log(this.pinchZoom)
    this.pinchZoom.disable()
  }
};
</script>
<style>
.pdf-viewer--fullscreen {
  display: flex;
  flex-direction: column;
}
.pdf-viewer--fullscreen .pdf-viewer__content {
  flex: 1;
  height: 100%;
  display: flex;
}
.pdf-viewer__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pdf-viewer__pdf canvas {
    width:  100% !important;
    height: auto !important;
}
.pdf-viewer__wrapper {
  position: relative !important;
}
.pinch-zoom-container {
  height: auto !important;
}
</style>


