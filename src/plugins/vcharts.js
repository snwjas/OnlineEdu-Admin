import Vue from 'vue'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'

Vue.component(VeLine.name, VeLine) // 折线图
Vue.component(VeHistogram.name, VeHistogram) // 柱状图
Vue.component(VePie.name, VePie) // 饼图
