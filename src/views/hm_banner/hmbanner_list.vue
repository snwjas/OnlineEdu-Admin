<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 添加/编辑 -->
      <el-col :xs="24" :sm="9">
        <el-card>
          <div slot="header">{{ isAdd ? '添加' : '修改' }}Banner</div>
          <el-form label-position="top" :model="addOrUpdateData" size="small">
            <el-form-item label="Banner海报：">
              <el-upload
                action=""
                :auto-upload="false"
                :show-file-list="false"
                accept=".png, .jpg, .jpeg"
                :on-change="selectBanner"
              >
                <el-image :src="encodeOssFileUri(addOrUpdateData.imageUrl)" fit="cover" class="banner-img">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-upload>
              <div class="input-tips">点击上传海报，图片不能超过2MB</div>
            </el-form-item>
            <el-form-item label="Banner标题：" prop="title">
              <el-input v-model="addOrUpdateData.title" />
            </el-form-item>
            <el-form-item label="Banner链接：" prop="linkUrl">
              <el-input v-model="addOrUpdateData.linkUrl" placeholder="请附带http[s]://前缀" />
            </el-form-item>
            <el-form-item label="Banner排序：" prop="sort">
              <el-input-number v-model="addOrUpdateData.sort" controls-position="right" style="width: 100%" />
            </el-form-item>
            <el-form-item label="Banner状态：" prop="enable">
              <el-radio-group v-model="addOrUpdateData.enable" style="position: absolute;top: -22px;left: 120px;">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="isAdd?createBanner():updateBanner()">
                  {{ isAdd ? '保 存' : '更 新' }}
                </el-button>
                <el-button v-if="!isAdd" @click="resetForm">返回添加</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 友链列表 -->
      <el-col :xs="24" :sm="15">
        <el-card>
          <div slot="header">Banner列表</div>
          <!-- 搜索框 -->
          <div class="search-box">
            <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
              <el-form-item label="标题：" prop="title">
                <el-input v-model="searchParams.title" placeholder="输入标题搜索" />
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
          <!-- 列表数据 -->
          <el-table
            ref="listTable"
            v-loading="tableDataLoading"
            :data="listData"
            tooltip-effect="dark"
            :header-cell-style="{fontWeight:'normal', color:'#666'}"
          >
            <el-table-column prop="title" label="标题" show-tooltip-when-overflow>
              <template slot-scope="scope">
                <el-link target="_blank" type="primary" :href="scope.row.linkUrl" :underline="false">
                  {{ scope.row.title }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="100" align="center" />
            <el-table-column prop="enable" label="状态" width="160" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="正常"
                  inactive-text="禁用"
                  :active-value="true"
                  :inactive-value="false"
                  @change="disenablle(scope.$index)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="tryUpdate(scope.$index)">查看/编辑</el-button>
                <el-popconfirm
                  placement="top-start"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  icon-color="red"
                  :title="`您要永久删除Banner[${scope.row.title}]吗？`"
                  style="margin-left: 10px"
                  @confirm="deleteBanner(scope.$index)"
                >
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div class="clearfix">
            <div class="pagination ">
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
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div>
      <el-dialog
        title="刷新Banner缓存"
        :visible.sync="refreshDialogVisible"
        destroy-on-close
        width="30%"
      >
        <div style="margin-bottom: 10px">
          <span style="color: red">该操作会使缓存中的Banner数据失效</span>
          <br><br>
          <span>同时会重新获取数据库中所有<strong>未禁用的</strong>Banner数据来刷新缓存</span>
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

import { list, disable, enable, createBanner, deleteBanner, updateBanner, refresh } from '@/api/banner'
import { encodeOssFileUri, jsonObj2FormData } from '@/utils'

export default {
  name: 'HmBannerList',
  data() {
    return {
      searchParams: {
        current: 1,
        pageSize: 10,
        enable: null,
        title: ''
      },
      total: 0,
      listData: [],
      tableDataLoading: false,
      isAdd: true,
      addOrUpdateData: {
        title: '',
        imageUrl: '',
        linkUrl: '',
        sort: 0,
        enable: true
      },
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
    resetForm() {
      this.isAdd = true
      this.addOrUpdateData = {
        title: '',
        imageUrl: '',
        linkUrl: '',
        sort: 0,
        enable: true
      }
    },
    encodeOssFileUri(ossUri) {
      return encodeOssFileUri(ossUri)
    },
    operationSuccess(msg) {
      this.$message.success(msg)
      this.resetForm()
      this.getList()
    },
    tryUpdate(index) {
      this.isAdd = false
      this.addOrUpdateData = JSON.parse(JSON.stringify(this.listData[index]))
    },
    selectBanner(file) {
      this.addOrUpdateData.imageUrl = URL.createObjectURL(file.raw)
      this.addOrUpdateData.file = file.raw
    },
    // 获取列表信息
    getList() {
      this.tableDataLoading = true
      list(this.searchParams).then(resp => {
        this.total = resp.data.total
        this.listData = resp.data.list
      })
      this.tableDataLoading = false
    },
    // 刷新Banner缓存
    refresh() {
      refresh().then(resp => {
        this.$message.success(resp.message)
      })
      this.refreshDialogVisible = false
    },
    // 启用或禁用用户
    disenablle(index) {
      const banner = this.listData[index]
      const fun = banner.enable ? enable : disable
      fun(banner.id).then(resp => {
        const msg = 'Banner[' + banner.title + ']已' + (banner.enable ? '启用' : '禁用')
        if (banner.enable) {
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    // 删除
    deleteBanner(index) {
      const id = this.listData[index].id
      deleteBanner(id).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    // 创建
    createBanner() {
      const params = jsonObj2FormData(this.addOrUpdateData)
      createBanner(params).then(resp => {
        this.operationSuccess(resp.message)
      })
    },
    // 更新
    updateBanner() {
      const params = jsonObj2FormData(this.addOrUpdateData)
      updateBanner(params).then(resp => {
        this.operationSuccess(resp.message)
      })
    }
  }
}
</script>

<style lang="scss">
.el-card {
  &__header, &__body {
    padding: 12px 12px;
  }
}
</style>

<style scoped lang="scss">
.banner-img {
  width: 360px;
  height: 120px;
  background-color: #f5f7fa;
  line-height: 120px;
}
</style>
