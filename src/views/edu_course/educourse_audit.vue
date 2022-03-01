<!-- 课程审核 -->
<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="课程名称：" prop="title">
          <el-input v-model="searchParams.title" placeholder="输入课程名称搜索" />
        </el-form-item>
        <el-form-item label="是否免费：" prop="free">
          <el-select v-model="searchParams.free" style="width: 130px">
            <el-option label="免费" :value="true" />
            <el-option label="收费" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：" prop="status">
          <el-select v-model="searchParams.status" style="width: 130px">
            <el-option label="待审核" :value="'AUDITING'" />
            <el-option label="初审" :value="'FIRST_AUDITING'" />
            <el-option label="二审" :value="'SECOND_AUDITING'" />
            <el-option label="已驳回" :value="'TURN_DOWN'" />
            <el-option label="草稿" :value="'DRAFT'" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="blog-list">
      <el-table
        ref="listTable"
        v-loading="tableDataLoading"
        :data="listData"
        tooltip-effect="dark"
        :header-cell-style="{fontWeight:'normal', color:'#666'}"
      >
        <el-table-column type="index" />
        <el-table-column prop="title" label="封面" width="130">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 48px" :src="encodeOssFileUri(scope.row.cover)" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" show-tooltip-when-overflow />
        <el-table-column prop="subjectId" label="分类" show-tooltip-when-overflow>
          <template slot-scope="scope">
            {{ getDetailsSubject(scope.row.subjectParent) }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">{{ scope.row.price === 0 ? '免费' : scope.row.price }}</template>
        </el-table-column>
        <el-table-column prop="lessonNum" label="总课时" width="100" />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="status" label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='FIRST_AUDITING'" type="" size="small">初审</el-tag>
            <el-tag v-else-if="scope.row.status==='SECOND_AUDITING'" type="" size="small">二审</el-tag>
            <el-tag v-else-if="scope.row.status==='DRAFT'" type="info" size="small">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openUpdateProfileDialog(scope.row)">修改</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="/FIRST_AUDITING|DRAFT/.test(scope.row.status)
                ?openWatchVideoDialog(scope.row)
                :openWatchVideoTmpDialog(scope.row)"
            >观看</el-button>
            <el-popconfirm
              style="margin:0 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`你要通过课程[${scope.row.title}]的审核吗？`"
              @confirm="pass(scope.row)"
            >
              <el-button slot="reference" type="success" size="mini">通过</el-button>
            </el-popconfirm>
            <el-button
              v-if="/AUDITING/.test(scope.row.status)"
              type="danger"
              size="mini"
              @click="openRejectDialog(scope.row)"
            >驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :page-sizes="[10, 20, 30, 40,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size.sync="searchParams.pageSize"
        :current-page.sync="searchParams.current"
        @size-change="getList"
        @current-change="getList"
      />
    </div>
    <!-- 修改信息 -->
    <el-dialog
      :title.sync="updateProfileDialogTitle"
      :visible.sync="updateProfileDialogVisible"
      destroy-on-close
      top="3vh"
      :close-on-click-modal="false"
    >
      <v-eduteacher-add-update ref="UpdateDialog" />
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateProfile">更 新</el-button>
        <el-button size="small" @click="updateProfileDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 观看视频(初审视频) -->
    <el-dialog
      :title.sync="watchVideoDialogTitle"
      :visible.sync="watchVideoDialogVisible"
      destroy-on-close
      top="5vh"
      width="70vw"
      :close-on-click-modal="false"
      :before-close="(done)=>{$refs.WatchDialog.dispose();done();}"
    >
      <v-eduteacher-watch ref="WatchDialog" />
    </el-dialog>
    <!-- 观看视频(二审视频) -->
    <el-dialog
      :title.sync="watchVideoDialogTitle"
      :visible.sync="watchVideoTmpDialogVisible"
      destroy-on-close
      top="5vh"
      width="70vw"
      :close-on-click-modal="false"
      :before-close="(done)=>{$refs.WatchTmpDialog.dispose();done();}"
    >
      <div style="margin-bottom: 12px;color: #F44336">
        * 视频标题带标志 "
        <el-badge is-dot>
          <i class="el-icon-video-play" style="margin-right: 6px" />
        </el-badge>
        &nbsp;" 说明是新上传的课程视频
      </div>
      <v-eduteacher-tmp-watch ref="WatchTmpDialog" />
    </el-dialog>
    <!-- 驳回审核 -->
    <el-dialog
      :title.sync="rejectDialogTitle"
      :visible.sync="rejectDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="rejectRemarks=''"
    >
      <el-input
        v-model="rejectRemarks"
        :rows="7"
        type="textarea"
        maxlength="511"
        show-word-limit
        placeholder="驳回备注"
      />
      <span slot="footer">
        <el-button type="primary" size="small" @click="reject">确 认</el-button>
        <el-button size="small" @click="rejectDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { list, updateIt, pass, reject } from '@/api/course'
import { jsonObj2FormData, encodeOssFileUri } from '@/utils'

export default {
  name: 'EduCourseAudit',
  components: {
    'v-eduteacher-add-update': () => import('@/views/edu_course/educourse_add_update'),
    'v-eduteacher-watch': () => import('@/views/edu_course/educourse_watch'),
    'v-eduteacher-tmp-watch': () => import('@/views/edu_course/educourse_tmp_watch')

  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        title: '',
        free: null,
        status: 'AUDITING'
      },
      total: 0,
      listData: [],
      tableDataLoading: false,
      currentOperationData: null,
      // 修改
      updateProfileDialogVisible: false,
      updateProfileDialogTitle: '',
      // 观看
      watchVideoDialogVisible: false, // 初审视频
      watchVideoTmpDialogVisible: false, // 二审视频
      watchVideoDialogTitle: '',
      // 驳回
      rejectDialogVisible: false,
      rejectDialogTitle: '',
      rejectRemarks: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.getList()
    },
    encodeOssFileUri(ossUri) {
      return encodeOssFileUri(ossUri)
    },
    openUpdateProfileDialog(curData) {
      this.updateProfileDialogVisible = true
      this.currentOperationData = curData
      this.updateProfileDialogTitle = `更改课程[${curData.title}]信息`
      setTimeout(function() {
        this.$refs.UpdateDialog.setData(curData)
      }.bind(this), 100)
    },
    // 初审视频
    openWatchVideoDialog(curData) {
      this.watchVideoDialogVisible = true
      this.watchVideoDialogTitle = `查看课程《${curData.title}》视频`
      setTimeout(function() {
        this.$refs.WatchDialog.setData(curData.id)
      }.bind(this), 100)
    },
    // 二审视频
    openWatchVideoTmpDialog(curData) {
      this.watchVideoTmpDialogVisible = true
      this.watchVideoDialogTitle = `查看课程《${curData.title}》视频`
      setTimeout(function() {
        this.$refs.WatchTmpDialog.setData(curData.id)
      }.bind(this), 100)
    },
    openRejectDialog(curData) {
      this.currentOperationData = curData
      this.rejectDialogVisible = true
      this.rejectDialogTitle = `驳回课程《${curData.title}》`
    },
    getDetailsSubject(subjectParent) {
      let subject = ''
      let parent = subjectParent
      while (parent) {
        subject = `${parent.title} > ${subject}`
        parent = parent.parent
      }
      return subject.substring(0, subject.length - 3)
    },
    // 获取列表信息
    getList() {
      this.tableDataLoading = true
      list(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.listData = resp.data.list
        this.tableDataLoading = false
      })
    },
    // 修改信息
    updateProfile() {
      const params = this.$refs.UpdateDialog.getData()
      updateIt(params).then(resp => {
        this.$message.success(resp.message)
        this.updateProfileDialogVisible = false
        this.getList()
      })
    },
    // 通过审核
    pass(curData) {
      this.currentOperationData = curData
      pass(curData.id).then(resp => {
        this.$message.success(`课程[${curData.title}]已通过审核`)
        this.getList()
      })
    },
    // 驳回审核
    reject() {
      const course = this.currentOperationData
      const params = jsonObj2FormData({ id: course.id, remarks: this.rejectRemarks })
      reject(params).then(resp => {
        this.$message.success(`课程[${course.title}]已驳回`)
        this.rejectDialogVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
