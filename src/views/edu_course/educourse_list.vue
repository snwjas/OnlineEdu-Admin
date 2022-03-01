<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="课程名称：" prop="title">
          <el-input v-model="searchParams.title" placeholder="输入课程名称搜索" />
        </el-form-item>
        <el-form-item label="课程分类：" prop="subjectId">
          <el-cascader
            v-model="searchParams.subjectId"
            :options="subjectOptions"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'title' }"
            :clearable="true"
            :filterable="true"
            placeholder="请选择课程分类"
            @change="subjectOptionsChange"
          />
        </el-form-item>
        <el-form-item label="是否免费：" prop="free">
          <el-select v-model="searchParams.free" style="width: 130px">
            <el-option label="免费" :value="true" />
            <el-option label="收费" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <el-select v-model="searchParams.enable" style="width: 130px">
            <el-option label="上架" :value="true" />
            <el-option label="下架" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
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
        <el-table-column prop="enable" label="上下架" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="上架"
              inactive-text="下架"
              :active-value="true"
              :inactive-value="false"
              @change="openEnableDialogVisible(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openUpdateProfileDialog(scope.row)">修改</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`你要永久删除课程[${scope.row.title}]吗？`"
              @confirm="deleteUser(scope.row)"
            >
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
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
    <div>
      <!-- 启用、禁用对话框 -->
      <el-dialog
        :title.sync="enableDialogTitle"
        :visible.sync="enableDialogVisible"
        destroy-on-close
        width="24%"
        @close="closeEnableDialogVisible"
      >
        <p>您确定要{{ enableDialogTitle }}吗？</p>
        <span slot="footer">
          <el-button type="primary" size="small" @click="disenablle">确 定</el-button>
          <el-button size="small" @click="enableDialogVisible=false">取 消</el-button>
        </span>
      </el-dialog>
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
    </div>
  </div>
</template>

<script>

import {
  list,
  enable,
  disable,
  deleteIt,
  updateIt
} from '@/api/course'

import { getSubject } from '@/api/subject'
import { encodeOssFileUri } from '@/utils'

export default {
  name: 'EduCourseist',
  components: {
    'v-eduteacher-add-update': () => import('@/views/edu_course/educourse_add_update')
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        teacherId: null,
        subjectId: null,
        title: '',
        free: null,
        status: 'PUBLISH', // 显示通过审核的
        enable: null
      },
      total: 0,
      listData: [],
      tableDataLoading: false,
      currentOperationData: null,
      // 启用、禁用
      enableDialogVisible: false,
      enableDialogTitle: '',
      // 修改
      updateProfileDialogVisible: false,
      updateProfileDialogTitle: '',
      // 分类选项
      subjectOptions: []
    }
  },
  created() {
    this.getList()
    this.getSubject()
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
    openEnableDialogVisible(curData) {
      this.currentOperationData = curData
      this.enableDialogTitle = `${curData.enable ? '上架' : '下架'}课程[${curData.title}]`
      this.enableDialogVisible = true
    },
    closeEnableDialogVisible() {
      this.enableDialogVisible = false
      const curData = this.currentOperationData
      curData.enable = !curData.enable
    },
    openUpdateProfileDialog(curData) {
      this.updateProfileDialogVisible = true
      this.currentOperationData = curData
      this.updateProfileDialogTitle = `更改课程[${curData.title}]信息`
      setTimeout(function() {
        this.$refs.UpdateDialog.setData(curData)
      }.bind(this), 100)
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
    getSubject() {
      getSubject().then(resp => {
        this.subjectOptions = resp.data
      })
    },
    subjectOptionsChange(val) {
      const arr = val
      if (!!arr || arr.length > 0) {
        this.searchParams.subjectId = arr[arr.length - 1]
      }
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
    // 启用或禁用
    disenablle() {
      const curData = this.currentOperationData
      const fun = curData.enable ? enable : disable
      fun(curData.id).then(resp => {
        const msg = '课程[' + curData.title + ']已' + (curData.enable ? '上架' : '下架')
        if (curData.enable) {
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
      })
      // 因为对话框关闭时会执行user.enable = !user.enable，所以在反一次
      curData.enable = !curData.enable
      this.enableDialogVisible = false
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
    // 删除用户
    deleteUser(curData) {
      this.currentOperationData = curData
      deleteIt(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
