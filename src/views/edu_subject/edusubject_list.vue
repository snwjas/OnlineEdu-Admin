<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="分类名称：" prop="title">
          <el-input v-model="searchParams.title" placeholder="输入分类名称搜索" />
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <el-select v-model="searchParams.enable" style="width: 130px">
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
          <el-button type="success" icon="el-icon-refresh" @click="refreshDialogVisible=true">刷新缓存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 12px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="createFirstDialogVisible=true">添加一级分类
      </el-button>
    </div>
    <div class="blog-list">
      <el-table
        ref="listTable"
        v-loading="tableDataLoading"
        :data="listData"
        tooltip-effect="dark"
        :header-cell-style="{fontWeight:'normal', color:'#666'}"
        :row-key="(row)=>row.parentId + ':' + row.id"
        :tree-props="{children: 'children'}"
      >
        <el-table-column prop="id" label="ID" width="200" />
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        <el-table-column prop="enable" label="状态" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="正常"
              inactive-text="禁用"
              :active-value="true"
              :inactive-value="false"
              @change="openEnableDialogVisible(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openCreateNotFirstDialog(scope.row)">添加</el-button>
            <el-button type="success" size="mini" @click="openUpdateProfileDialog(scope.row)">修改</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`你要永久删除分类[${scope.row.title}]吗？`"
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
        <p style="color: red">该操作会影响到该分类下的所有子分类</p>
        <p>禁用：该分类将无法使用和显示</p>
        <p>启用：该分类将恢复使用和显示</p>
        <span slot="footer">
          <el-button type="primary" size="small" @click="disenablle">确 定</el-button>
          <el-button size="small" @click="enableDialogVisible=false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog
        :title.sync="updateProfileDialogTitle"
        :visible.sync="updateProfileDialogVisible"
        destroy-on-close
        width="30%"
      >
        <v-edusubject-add-update ref="UpdateDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="updateProfile">更 新</el-button>
          <el-button size="small" @click="updateProfileDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 添加一级分类 -->
      <el-dialog
        title="添加一级分类"
        :visible.sync="createFirstDialogVisible"
        destroy-on-close
        width="30%"
      >
        <v-edusubject-add-update ref="AddFirstDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="createUser(true)">创 建</el-button>
          <el-button size="small" @click="createFirstDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 添加非一级分类 -->
      <el-dialog
        :title="createNotFirstDialogTitle"
        :visible.sync="createNotFirstDialogVisible"
        destroy-on-close
        width="30%"
      >
        <v-edusubject-add-update ref="AddNotFirstDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="createUser(false)">创 建</el-button>
          <el-button size="small" @click="createNotFirstDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="刷新分类缓存"
        :visible.sync="refreshDialogVisible"
        destroy-on-close
        width="30%"
      >
        <div style="margin-bottom: 10px">
          <span style="color: red">该操作会使缓存中的课程分类数据失效</span>
          <br><br>
          <span>同时会重新获取数据库中所有<strong>未禁用的一级分类</strong>数据来刷新缓存</span>
        </div>
        <span slot="footer">
          <el-button type="primary" size="small" @click="refresh">确 认</el-button>
          <el-button size="small" @click="refreshDialogVisible = false">取 消</el-button>
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
  deleteSubject,
  createSubject,
  updateSubject,
  refresh
} from '@/api/subject'

export default {
  name: 'EduSubjectList',
  components: {
    'v-edusubject-add-update': () => import('@/views/edu_subject/edusubject_add_update')
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        title: '',
        parentId: 0,
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
      // 添加一级分类
      createFirstDialogVisible: false,
      // 添加非一级分类
      createNotFirstDialogVisible: false,
      createNotFirstDialogTitle: '',
      // 刷新缓存
      refreshDialogVisible: false
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
    openEnableDialogVisible(curData) {
      this.currentOperationData = curData
      this.enableDialogTitle = `${curData.enable ? '启用' : '禁用'}分类[${curData.title}]`
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
      this.updateProfileDialogTitle = `更改分类[${curData.title}]信息`
      setTimeout(function() {
        this.$refs.UpdateDialog.setData(curData)
      }.bind(this), 100)
    },
    openCreateNotFirstDialog(curData) {
      this.createNotFirstDialogVisible = true
      this.currentOperationData = curData
      this.createNotFirstDialogTitle = `为[${curData.title}]添加子分类`
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
    // 刷新缓存
    refresh() {
      refresh().then(resp => {
        this.$message.success(resp.message)
      })
      this.refreshDialogVisible = false
    },
    // 启用或禁用
    disenablle() {
      const curData = this.currentOperationData
      const fun = curData.enable ? enable : disable
      fun(curData.id).then(resp => {
        const msg = '分类[' + curData.title + ']已' + (curData.enable ? '启用' : '禁用')
        if (curData.enable) {
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
        this.getList()
      })
      // 因为对话框关闭时会执行user.enable = !user.enable，所以在反一次
      curData.enable = !curData.enable
      this.enableDialogVisible = false
    },
    // 修改信息
    updateProfile() {
      const params = this.$refs.UpdateDialog.getData()
      updateSubject(params).then(resp => {
        this.$message.success(resp.message)
        this.updateProfileDialogVisible = false
        this.getList()
      })
    },
    // 删除
    deleteUser(curData) {
      this.currentOperationData = curData
      deleteSubject(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    },
    // 创建(指定是否一级分类)
    createUser(isFirst) {
      const params = isFirst
        ? this.$refs.AddFirstDialog.getData()
        : this.$refs.AddNotFirstDialog.getData()
      if (!isFirst) {
        params.parentId = this.currentOperationData.id
      }
      createSubject(params).then(resp => {
        this.$message.success(resp.message)
        this.createFirstDialogVisible = false
        this.createNotFirstDialogVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
