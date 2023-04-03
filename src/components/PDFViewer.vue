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
    <div
         class="pdf-viewer__content"
         @touchstart="onTouchStart"
         @touchmove="onTouchMove"
         @touchend="onTouchEnd"
    >
      <div class="pdf-viewer__wrapper">
        <VuePDF class="pdf-viewer__pdf" :pdf="pdf" :page="currentPage" :scale="scale"/>
      </div>
    </div>
  </fullscreen>
</template>

<script>
import { usePDF, VuePDF } from "@tato30/vue-pdf";
import url from '@/assets/files/mexanicna_filtraciya_01_de.pdf'
import { component } from 'vue-fullscreen'

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
    dist1: 0,
    dist2: 0
  }),
  computed: {
    mainClasses () {
      return {
        'pdf-viewer--fullscreen': this.fullscreen
      }
    }
  },
  methods: {
    onTouchStart (e) {
      e.preventDefault();

      console.log(e.targetTouches)

      if (e.targetTouches.length === 2) {

        this.dist1 = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      }
    },
    onTouchMove (e) {
      e.preventDefault();
      console.log(e.targetTouches)

      if (e.targetTouches.length === 2 && e.changedTouches.length === 2) {
        this.dist2 = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY);
        if(this.dist1>this.dist2) {
          console.log('zoom out');
        }
        if(this.dist1<this.dist2) {
          console.log('zoom in');
        }
      }
    },
    onTouchEnd () {

    }
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
  overflow: auto;
}
.pdf-viewer__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.pdf-viewer__wrapper {
  zoom: 1;
}
.pdf-viewer__pdf canvas {
    width:  100% !important;
    height: auto !important;
}
</style>


