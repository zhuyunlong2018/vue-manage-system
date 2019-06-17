<template>
  <canvas :ref="canvasId"></canvas>
</template>

<script>
/**
 * 动态生成二维码
 */
import QRCode from "qrcode";
import { randomString } from "@/utils";
export default {
  props: ["id", "content", "width"],
  data() {
    return {
      codes: "",
      canvasId: "",
      options: {}
    };
  },
  components: {
    QRCode
  },
  methods: {
    useqrcode() {
      QRCode.toCanvas(
        this.$refs[this.canvasId], //canvas dom对象
        this.content, //二维码内容
        this.options, //参数，暂时只有width
        function(error) {
          //回调
          if (error) console.error(error);
        }
      );
    }
  },
  mounted() {
    this.useqrcode();
  },
  created() {
    if (this.width) {
      this.options.width = this.width;
    }
    if (this.id) {
      this.canvasId = this.id;
    } else {
      this.canvasId = randomString(10);
    }
  }
};
</script>
