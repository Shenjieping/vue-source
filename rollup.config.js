import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js', // 打包出的dist文件
    format: 'umd', // 统一模块化规范，如果都没有，将打包后的结果挂载到window上
    name: 'Vue',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // 排除不需要编译文件
    }),
    serve({ // 开启本地服务
      openPage: '/public/index.html',
      port: 3000,
      contentBase: '',
      open: true
    })
  ]
}