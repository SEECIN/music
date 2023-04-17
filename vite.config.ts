import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
const path = require("path");
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".ts", ".js", ".vue", ".json"],
  },
  css: {
    postcss: {
      plugins: [
        require("postcss-pxtorpx-pro")({
          // 转化的单位
          unit: "rpx",
          // 单位精度
          unitPrecision: 5,
          // 不需要处理的css选择器
          selectorBlackList: [],
          // 不需要转化的css属性
          propBlackList: [],
          // 直接修改px，还是新加一条css规则
          replace: true,
          // 是否匹配媒介查询的px
          mediaQuery: false,
          // 需要转化的最小的pixel值，低于该值的px单位不做转化
          minPixelValue: 2,
          // 不处理的文件
          // exclude: /node_modules|components/gi,
          // 转化函数
          // 视口375px
          transform: (x: any) => 2 * x,
        }),
      ],
    },
  },
});
