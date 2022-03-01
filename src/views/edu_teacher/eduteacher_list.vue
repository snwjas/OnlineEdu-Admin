<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="讲师名称：" prop="name">
          <el-input v-model="searchParams.name" placeholder="输入讲师名称搜索" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="searchParams.mobile" placeholder="输入手机号搜索" />
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
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 12px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="createDialogVisible=true">添加讲师</el-button>
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
        <el-table-column prop="name" label="讲师名称" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="email" label="邮箱地址" />
        <el-table-column prop="division" label="分成比例" width="80" align="center" />
        <el-table-column prop="enable" label="状态" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="正常"
              inactive-text="禁用"
              :active-value="true"
              :inactive-value="false"
              @change="openEnableDialogVisible(scope.$index)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openUpdateProfileDialog(scope.$index)">修改</el-button>
            <el-button type="success" size="mini" @click="openViewResumeDialog(scope.$index)">预览</el-button>
            <el-button type="info" size="mini" @click="openUpdatePasswordDialog(scope.$index)">改密</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`你要永久删除讲师[${scope.row.name}]吗？`"
              @confirm="deleteUser(scope.$index)"
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
      <!-- 启用、禁用账户对话框 -->
      <el-dialog
        :title.sync="enableDialogTitle"
        :visible.sync="enableDialogVisible"
        destroy-on-close
        width="24%"
        @close="closeEnableDialogVisible"
      >
        <p>禁用：账户将丧失登录认证的资格</p>
        <p>启用：账户将恢复登录认证的资格</p>
        <span slot="footer">
          <el-button type="primary" size="small" @click="disenablle">确 定</el-button>
          <el-button size="small" @click="enableDialogVisible=false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 修改密码对话框 -->
      <el-dialog
        :title.sync="updatePasswordDialogTitle"
        :visible.sync="updatePasswordDialogVisible"
        destroy-on-close
        width="24%"
        @closed="()=>{newPassword=''}"
      >
        <el-input v-model="newPassword" size="small" autocomplete="off" placeholder="请输入账户新密码" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="updatePassword">更 新</el-button>
          <el-button size="small" @click="updatePasswordDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 修改账户信息 -->
      <el-dialog
        :title.sync="updateProfileDialogTitle"
        :visible.sync="updateProfileDialogVisible"
        destroy-on-close
      >
        <v-eduteacher-add-update ref="UpdateDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="updateProfile">更 新</el-button>
          <el-button size="small" @click="updateProfileDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 添加账户 -->
      <el-dialog
        title="添加讲师"
        :visible.sync="createDialogVisible"
        destroy-on-close
      >
        <div style="color: red;margin-bottom: 20px">* 新账户默认密码为<strong>654321</strong>，创建账户后请修改</div>
        <v-eduteacher-add-update ref="AddDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="createUser">创 建</el-button>
          <el-button size="small" @click="createDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 预览简历 -->
      <el-dialog
        :title="viewResumeDialogTitle"
        :visible.sync="viewResumeDialogVisible"
        destroy-on-close
        width="60vw"
        top="5vh"
      >
        <div style="height: 80vh;overflow: auto">
          <div style="margin-bottom: 20px">
            <el-link :underline="false" :href="listData[currentOperationIndex].resume" target="_blank">
              <i class="el-icon-link" />
              在浏览器新标签打开
            </el-link>
          </div>
          <div v-if="isPdf">
            <pdf
              v-for="i in pdfPages"
              :key="i"
              ref="pdf"
              :page="i"
              :src="pdfSrc"
            />
          </div>
          <img v-else-if="isImg" style="width: 100%" :src="listData[currentOperationIndex].resume" alt="">
          <div v-else style="text-align: center;padding: 30px;font-size: 26px">加载失败</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {
  list,
  enable,
  disable,
  deleteUser,
  updatePassword,
  createUser,
  updateProfile
} from '@/api/teacher'
import pdf from 'vue-pdf'

export default {
  name: 'EduTeacherist',
  components: {
    'v-eduteacher-add-update': () => import('@/views/edu_teacher/eduteacher_add_update'),
    pdf
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        name: '',
        mobile: '',
        enable: null
      },
      total: 0,
      listData: [{}],
      tableDataLoading: false,
      currentOperationIndex: 0,
      // 启用、禁用
      enableDialogVisible: false,
      enableDialogTitle: '',
      // 改密
      updatePasswordDialogVisible: false,
      updatePasswordDialogTitle: '',
      newPassword: '',
      // 修改
      updateProfileDialogVisible: false,
      updateProfileDialogTitle: '',
      // 添加账户
      createDialogVisible: false,
      // 浏览简历
      viewResumeDialogVisible: false,
      viewResumeDialogTitle: '',
      pdfSrc: null,
      pdfPages: undefined
    }
  },
  computed: {
    isImg() {
      try {
        const resume = this.listData[this.currentOperationIndex].resume || ''
        return /^.*\.(jpg|jpeg|png)$/i.test(resume)
      } catch (e) {
        return false
      }
    },
    isPdf() {
      try {
        const resume = this.listData[this.currentOperationIndex].resume || ''
        return /^.*\.(pdf)$/i.test(resume)
      } catch (e) {
        return false
      }
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
    setIndexAndGetListData(index) {
      this.currentOperationIndex = index
      return this.listData[this.currentOperationIndex]
    },
    openEnableDialogVisible(index) {
      const user = this.setIndexAndGetListData(index)
      this.enableDialogTitle = `${user.enable ? '启用' : '禁用'}讲师[${user.name}]`
      this.enableDialogVisible = true
    },
    closeEnableDialogVisible() {
      this.enableDialogVisible = false
      const user = this.listData[this.currentOperationIndex]
      user.enable = !user.enable
    },
    openUpdatePasswordDialog(index) {
      this.updatePasswordDialogVisible = true
      const user = this.setIndexAndGetListData(index)
      this.updatePasswordDialogTitle = `更改讲师[${user.name}]密码`
    },
    openUpdateProfileDialog(index) {
      this.updateProfileDialogVisible = true
      const user = this.setIndexAndGetListData(index)
      this.updateProfileDialogTitle = `更改讲师[${user.name}]信息`
      setTimeout(function() {
        this.$refs.UpdateDialog.setData(user)
      }.bind(this), 100)
    },
    openViewResumeDialog(index) {
      this.viewResumeDialogVisible = true
      const user = this.setIndexAndGetListData(index)
      this.viewResumeDialogTitle = `预览讲师[${user.name}]简历`
      // 加载pdf
      this.pdfSrc = null
      if (user.resume) {
        this.pdfSrc = pdf.createLoadingTask(user.resume)
        this.pdfSrc.promise
          .then(pdf => {
            this.pdfPages = pdf.numPages
          })
          .catch(() => {
            this.pdfPages = undefined
          })
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
      this.currentOperationIndex = 0
    },
    // 启用或禁用用户
    disenablle() {
      const user = this.listData[this.currentOperationIndex]
      const fun = user.enable ? enable : disable
      fun(user.id).then(resp => {
        const msg = '讲师账户[' + user.name + ']已' + (user.enable ? '启用' : '禁用')
        if (user.enable) {
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
      })
      // 因为对话框关闭时会执行user.enable = !user.enable，所以在反一次
      user.enable = !user.enable
      this.enableDialogVisible = false
    },
    // 修改信息
    updateProfile() {
      const params = this.$refs.UpdateDialog.getData()
      updateProfile(params).then(resp => {
        this.$message.success(resp.message)
        this.updateProfileDialogVisible = false
        this.getList()
      })
    },
    // 修改密码
    updatePassword() {
      const user = this.listData[this.currentOperationIndex]
      const params = { userId: user.id, newPassword: this.newPassword }
      updatePassword(params).then(resp => {
        this.$message.success(resp.message)
        this.updatePasswordDialogVisible = false
      })
    },
    // 删除用户
    deleteUser(index) {
      const user = this.setIndexAndGetListData(index)
      deleteUser(user.id).then(resp => {
        this.$message.success(resp.message)
        this.getList()
      })
    },
    // 创建用户
    createUser() {
      const params = this.$refs.AddDialog.getData()
      params.password = '654321'
      createUser(params).then(resp => {
        this.$message.success(resp.message)
        this.createDialogVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
