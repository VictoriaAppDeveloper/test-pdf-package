<template>
  <BaseFullscreen
              v-model="fullscreen"
              class="pdf-viewer"
              :class="mainClasses"

  >
    <div class="pdf-viewer__actions">
      <button class="primary" @click="fullscreen = !fullscreen">fullscreen</button>
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
  </BaseFullscreen>
</template>

<script>
import { usePDF, VuePDF } from "@tato30/vue-pdf";
import url from '@/assets/files/Andrei_Zabelin.pdf'
import BaseZoom from "@/components/BaseZoom.vue";
import BaseFullscreen from "@/components/BaseFullscreen.vue";
export default {
  components: {
    BaseFullscreen,
    BaseZoom,
    VuePDF,
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
  },
  watch: {
    fullscreen () {
      this.$nextTick(() => {
        this.$refs.baseZoom.reset()
      })
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

button {
  min-width: 48px;
  height: 48px;
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


