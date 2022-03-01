<template>
  <ve-line v-loading="loading" :data="chartData" :settings="chartSettings" :extend="extend" />
</template>

<script>
import { getDaily } from '@/api/stat'
import { jsonObj2FormData, parseTime } from '@/utils'

export default {
  name: 'StatDaily',
  props: {
    startEnd: {
      type: Array,
      default: function() {
        const now = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()
        const start = parseTime(now - 30 * 24 * 60 * 60 * 1000)
        const end = parseTime(now)
        return [start, end]
      }
    }
  },
  data() {
    return {
      loading: false,
      chartData: {
        columns: ['date', 'visitCount', 'registerCount', 'loginCount', 'videoViewCount', 'courseBuyCount'],
        rows: []
      },
      chartSettings: {
        labelMap: {
          visitCount: '访问量',
          registerCount: '注册量',
          loginCount: '活跃量',
          videoViewCount: '播放量',
          courseBuyCount: '订阅量'
        },
        area: true
      },
      extend: {
        legend: {
          left: '12'
        },
        grid: {
          bottom: '10'
        }
      }
    }
  },
  watch: {
    startEnd(val) {
      this.getDailyStat()
    }
  },
  created() {
    this.getDailyStat()
  },
  methods: {
    getDailyStat() {
      this.loading = true
      const params = jsonObj2FormData({
        start: this.startEnd[0],
        end: this.startEnd[1]
      })
      getDaily(params).then(response => {
        this.chartData.rows = response.data
        this.loading = false
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>

</style>
