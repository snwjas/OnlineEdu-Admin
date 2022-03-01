<template>
  <div class="app-container">
    <div class="search-box">
      <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
        <el-form-item label="用户ID:" prop="memberId">
          <el-input v-model="searchParams.memberId" placeholder="输入用户ID搜索" style="width: 150px" />
        </el-form-item>
        <el-form-item label="订单号:" prop="orderNo">
          <el-input v-model="searchParams.orderNo" placeholder="输入订单号搜索" style="width: 150px" />
        </el-form-item>
        <el-form-item label="支付状态:" prop="payType">
          <el-select v-model="searchParams.payType" style="width: 100px">
            <el-option label="未支付" value="NONE" />
            <el-option label="微信支付" value="WECHAT_PAY" />
            <el-option label="支付宝" value="ALI_PAY" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:" prop="enable">
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
    <div>
      <el-table
        ref="listTable"
        v-loading="tableDataLoading"
        :data="listData"
        tooltip-effect="dark"
        :header-cell-style="{fontWeight:'normal', color:'#666'}"
      >
        <el-table-column type="index" />
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="totalFee" label="订单金额" />
        <el-table-column prop="createTime" label="创建时间" width="200" align="center" />
        <el-table-column prop="payType" label="支付状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payType==='WECHAT_PAY'" type="success" size="small">微信支付</el-tag>
            <el-tag v-else-if="scope.row.payType==='ALI_PAY'" type="primary" size="small">支付宝</el-tag>
            <el-tag v-else type="info" size="small">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="transactionNum" label="流水号">
          <template slot-scope="scope">{{ scope.row.transactionNum || '无' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openDetailDialog(scope.row)">订单详情</el-button>
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
      <!-- 修改账户信息 -->
      <el-dialog
        :title.sync="detailDialogTitle"
        :visible.sync="detailDialogVisible"
        destroy-on-close
      >
        <v-details ref="DetailsDialog" />
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { list } from '@/api/order'

export default {
  name: 'TOrderList',
  components: {
    'v-details': () => import('@/views/t_order/torder_details')
  },
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        orderNo: '',
        memberId: null,
        payType: null,
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
      // 启用、禁用
      detailDialogVisible: false,
      detailDialogTitle: ''
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
    openDetailDialog(curData) {
      this.detailDialogVisible = true
      this.detailDialogTitle = `订单[${curData.orderNo}]信息`
      setTimeout(function() {
        this.$refs.DetailsDialog.setData(curData)
      }.bind(this), 100)
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
