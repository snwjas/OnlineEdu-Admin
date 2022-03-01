<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="6">
        <!-- 管理员 -->
        <el-col :xs="12" :sm="24" style="padding:0">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">管理员数量</span>
            </div>
            <div class="cardContent clearfix">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">管理员总数量为：{{ stat.adminCount }}</div>
                <span>{{ stat.adminCount }}</span>
              </el-tooltip>
              <el-tooltip effect="dark" placement="top">
                <div slot="content">{{ stat.disabledAdminCount }} 名管理员被禁用</div>
                <span style="float: right;color: #F44336">{{ stat.disabledAdminCount }}</span>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
        <!-- 讲师 -->
        <el-col :xs="12" :sm="24" style="padding:0">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">讲师数量</span>
            </div>
            <div class="cardContent clearfix">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">讲师总数量为：{{ stat.teacherCount }}</div>
                <span>{{ stat.teacherCount }}</span>
              </el-tooltip>
              <el-tooltip effect="dark" placement="top">
                <div slot="content">{{ stat.disabledTeacherCount }} 名讲师被禁用</div>
                <span style="float: right;color: #F44336">{{ stat.disabledTeacherCount }}</span>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
        <!-- 视频 -->
        <el-col :xs="12" :sm="24" style="padding:0">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="cardName">视频数量</span>
            </div>
            <div class="cardContent clearfix">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">课程视频总数量为：{{ stat.videoCount }}</div>
                <span>{{ stat.videoCount }}</span>
              </el-tooltip>
            </div>
          </el-card>
        </el-col>
      </el-col>
      <!-- 学员 -->
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">学员数量</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">学员总数量为：{{ stat.studentCount }}</div>
              <span>{{ stat.studentCount }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{ stat.disabledStudentCount }} 名学员被禁用</div>
              <span style="float: right;color: #F44336">{{ stat.disabledStudentCount }}</span>
            </el-tooltip>
            <div style="margin-top: 16px">
              <ve-pie
                height="238px"
                :data="{columns:['name','val'],rows:[
                  {name:'保密',val:stat.studentCount-stat.femaleStudentCount-stat.maleStudentCount},
                  {name:'男性',val:stat.maleStudentCount},
                  {name:'女性',val:stat.femaleStudentCount}
                ]}"
                :settings="{radius:64,offsetY:136}"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 订单 -->
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">订单数量</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">订单总数量为：{{ stat.orderCount }}</div>
              <span>{{ stat.orderCount }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{ stat.orderPayByNoneCount }} 个订单未支付</div>
              <span style="float: right;color: #F44336">{{ stat.orderPayByNoneCount }}</span>
            </el-tooltip>
            <div style="margin-top: 16px">
              <ve-pie
                height="238px"
                :data="{columns:['name','val'],rows:[
                  {name:'微信支付',val:stat.orderPayByWechatCount},
                  {name:'支付宝',val:stat.orderPayByAlipayCount},
                ]}"
                :settings="{radius:64,offsetY:136}"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 课程 -->
      <el-col :xs="12" :sm="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardName">课程数量</span>
          </div>
          <div class="cardContent clearfix">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">课程总数量为：{{ stat.courseCount }}</div>
              <span>{{ stat.courseCount }}</span>
            </el-tooltip>
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{ stat.disabledCourseCount }} 门课程已被下架</div>
              <span style="float: right;color: #F44336">{{ stat.disabledCourseCount }}</span>
            </el-tooltip>
            <div style="margin-top: 16px">
              <ve-histogram
                height="238px"
                :data="{columns:['name','val'],rows:[
                  {name:'上架',val:stat.enabledCourseCount},
                  {name:'审核',val:stat.auditingCourseCount},
                  {name:'草稿',val:stat.editingCourseCount},
                  {name:'驳回',val:stat.rejectedCourseCount}
                ]}"
                :legend-visible="false"
                :settings="{labelMap:{val:'数量'}}"
                :extend="{
                  series:{label:{show:true,position:'top'}},
                  yAxis:{splitLine:{show:false},axisLine: {show: true},position: 'left'},
                  xAxis:{splitLine:{show:false},axisLine: {show: true},position: 'bottom'}
                }"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 每日统计量 -->
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="height: 28px;line-height: 28px">
            <span class="cardName">每日数据统计</span>
            <div class="cardName" style="float: right">
              统计日期区间：
              <el-date-picker
                v-model="beginToEnd"
                style="width: 260px"
                size="mini"
                type="daterange"
                :picker-options="pickerOptions"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </div>
          </div>
          <v-stat-daily :start-end="beginToEnd" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getCommon } from '@/api/stat'
import { parseTime } from '@/utils'

export default {
  name: 'Dashboard',
  components: {
    'v-stat-daily': () => import('@/views/dashboard/daily')
  },
  data() {
    return {
      stat: {
        adminCount: 0,
        disabledAdminCount: 0,
        teacherCount: 0,
        disabledTeacherCount: 0,
        studentCount: 0,
        disabledStudentCount: 0,
        femaleStudentCount: 0,
        courseCount: 0,
        enabledCourseCount: 0,
        disabledCourseCount: 0,
        editingCourseCount: 0,
        auditingCourseCount: 0,
        rejectedCourseCount: 0,
        videoCount: 0,
        orderCount: 0,
        orderPayByWechatCount: 0,
        orderPayByAlipayCount: 0,
        orderPayByNoneCount: 0,
        maleStudentCount: 0
      },
      // 统计时间选择框选项
      pickerOptions: {
        shortcuts: [{
          text: '最近半个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // [begin, end]
      beginToEnd: [
        parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() - 30 * 24 * 60 * 60 * 1000, ''),
        parseTime(new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(), '')
      ]
    }
  },
  computed: {
    defaultBeginToEnd() {
      const now = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()
      const start = parseTime(now - 30 * 24 * 60 * 60 * 1000, '')
      const end = parseTime(now, '')
      return [start, end]
    }
  },
  created() {
    this.getCommonStat()
  },
  methods: {
    getCommonStat() {
      getCommon().then(resp => {
        this.stat = resp.data
      })
    }
  }
}
</script>

<style lang="scss">
.el-col {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-card {
  &__header, &__body {
    padding: 12px 16px;
    line-height: 16px;
  }
}
</style>

<style lang="scss" scoped>
.box-card {
  .cardName {
    color: #97a8be;
  }

  .cardLink {
    float: right;
    padding: 0;
  }

  .cardContent {
    font-size: 26px;
    padding: 12px 0;
  }
}
</style>
