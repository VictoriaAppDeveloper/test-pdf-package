<template>
  <main>
    <div class="card">
      <PDFViewer />
    </div>
  </main>
</template>
<script>
import PDFViewer from "@/components/PDFViewer.vue";
export default {
  components: {
    PDFViewer,
  },
};
</script>
<style>
.card {
  border: 1px solid black;
  border-radius: 16px;
  padding: 16px;
  width: 700px;
}
</style>
