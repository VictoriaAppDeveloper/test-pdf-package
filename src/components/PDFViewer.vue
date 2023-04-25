<template>
  <div
class="pdf-viewer"
       :class="mainClasses"

  >
    <div class="pdf-viewer__actions">
      <button v-fullscreen.teleport="fullscreenOptions" class="primary">fullscreen</button>
      <button class="primary" @click="zoomIn">+</button>
      <button class="primary" @click="zoomOut">-</button>
    </div>
    <div class="pdf-viewer__content">
      <BaseZoom
              ref="baseZoom"
                v-model="zoom"
                class="pdf-viewer__wrapper"
                aspect-ratio="16/9"
                :disable-aspect-ratio="fullscreen"
      >
        <div v-for="(page, key) of pages" :key="key">
          <VuePDF class="pdf-viewer__pdf" :pdf="pdf" :page="page" :scale="scale"/>
        </div>
      </BaseZoom>
    </div>
  </div>
</template>

<script>
import { usePDF, VuePDF } from "@tato30/vue-pdf";
import url from '@/assets/files/Andrei_Zabelin.pdf'
import { directive as fullscreen } from 'vue-fullscreen'
import BaseZoom from "@/components/BaseZoom.vue";
export default {
  components: {
    BaseZoom,
    VuePDF,
  },
  directives: {
    fullscreen
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
    fullscreen: false,
    zoom: 1,
    maxZoom: 5,
    minZoom: 1
  }),
  computed: {
    mainClasses () {
      return {
        'pdf-viewer--fullscreen': this.fullscreen
      }
    },
    fullscreenOptions () {
      const that = this
      return {
        target: ".pdf-viewer",
        callback (value) {
          that.fullscreen = value
          that.$refs.baseZoom.reset()
        },
      }
    }
  },
  methods: {
    zoomIn () {
      if (this.zoom < this.maxZoom) {
        this.zoom += 1
      }
    },
    zoomOut () {
      if (this.zoom > this.minZoom) {
        this.zoom -= 1
      }
    }
  },
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
.pdf-viewer__content {
  overflow: hidden;
}
.pdf-viewer__actions {
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
  z-index: 1;
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
button {
  min-width: 48px;
  height: 48px;
}
</style>


