<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="searchParams.nickname" placeholder="输入昵称搜索" style="width: 150px" />
        </el-form-item>
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="searchParams.mobile" placeholder="输入手机号搜索" style="width: 150px" />
        </el-form-item>
        <el-form-item label="状态:" prop="enable">
          <el-select v-model="searchParams.enable" style="width: 100px">
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间:" prop="enable">
          <el-date-picker
            v-model="beginToEndCreate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 12px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="createDialogVisible=true">添加学员</el-button>
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
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="mobile" label="手机号" width="150" align="center" />
        <el-table-column prop="email" label="邮箱地址" show-tooltip-when-overflow />
        <el-table-column prop="sex" label="性别" width="70" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex==='FEMALE'" style="color: #f84a4a">女</span>
            <span v-else-if="scope.row.sex==='MALE'" style="color: #20a0ff">男</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="70" align="center" />
        <el-table-column prop="createTime" label="注册时间" width="160" align="center" />
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
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openUpdateProfileDialog(scope.$index)">修改</el-button>
            <el-button type="success" size="mini" @click="openUpdatePasswordDialog(scope.$index)">改密</el-button>
            <el-popconfirm
              style="margin-left: 10px"
              placement="top-end"
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="`你要永久删除[${scope.row.nickname}]吗？`"
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
        <v-add-update ref="UpdateDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="updateProfile">更 新</el-button>
          <el-button size="small" @click="updateProfileDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 添加账户 -->
      <el-dialog
        title="添加学员"
        :visible.sync="createDialogVisible"
        destroy-on-close
      >
        <div style="color: red;margin-bottom: 20px">* 新账户默认密码为<strong>654321</strong>，创建账户后请修改</div>
        <v-add-update ref="AddDialog" />
        <span slot="footer">
          <el-button type="primary" size="small" @click="createUser">创 建</el-button>
          <el-button size="small" @click="createDialogVisible = false">取 消</el-button>
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
  deleteUser,
  updatePassword,
  createUser,
  updateProfile
} from '@/api/member'

export default {
  name: 'UctrMemberList',
  components: {
    'v-add-update': () => import('@/views/uctr_member/uctrmember_add_update')
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        nickname: '',
        mobile: '',
        enable: null,
        beginCreate: null,
        endCreate: null
      },
      // 注册时间选择框选项
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
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
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      beginToEndCreate: '', // 注册时间 [begin, end]
      total: 0,
      listData: [],
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
      createDialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetSearchParams(formName) {
      this.$refs[formName].resetFields()
      this.searchParams.current = 1
      this.beginToEndCreate = ''
      this.getList()
    },
    setIndexAndGetListData(index) {
      this.currentOperationIndex = index
      return this.listData[this.currentOperationIndex]
    },
    openEnableDialogVisible(index) {
      const user = this.setIndexAndGetListData(index)
      this.enableDialogTitle = `${user.enable ? '启用' : '禁用'}学员[${user.nickname}]`
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
      this.updatePasswordDialogTitle = `更改学员[${user.nickname}]密码`
    },
    openUpdateProfileDialog(index) {
      this.updateProfileDialogVisible = true
      const user = this.setIndexAndGetListData(index)
      this.updateProfileDialogTitle = `更改学员[${user.nickname}]信息`
      setTimeout(function() {
        this.$refs.UpdateDialog.setData(user)
      }.bind(this), 200)
    },
    // 获取列表信息
    getList() {
      this.tableDataLoading = true
      // 处理注册时间选择
      if (this.beginToEndCreate) { // 选择了
        this.searchParams.beginCreate = this.beginToEndCreate[0]
        this.searchParams.endCreate = this.beginToEndCreate[1]
      } else {
        this.searchParams.beginCreate = null
        this.searchParams.endCreate = null
      }
      list(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.listData = resp.data.list
        this.tableDataLoading = false
      })
    },
    // 启用或禁用用户
    disenablle() {
      const user = this.listData[this.currentOperationIndex]
      const fun = user.enable ? enable : disable
      fun(user.id).then(resp => {
        const msg = '学员账户[' + user.nickname + ']已' + (user.enable ? '启用' : '禁用')
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
