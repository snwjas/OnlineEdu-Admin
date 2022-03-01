<template>
  <div>
    <el-divider>课程信息</el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <div style="float: left">课程封面：</div>
        <el-image :src="encodeOssFileUri(course.cover)" fit="cover" style="width: 200px;height: 100px" />
      </el-col>
      <el-col :span="12">课程标题：{{ course.title }}</el-col>
      <el-col :span="12">课程分类：{{ getDetailsSubject(course.subjectParent) }}</el-col>
      <el-col :span="12">价格分类：{{ course.price }}</el-col>
    </el-row>
    <el-divider>学员信息</el-divider>
    <el-row :gutter="20">
      <el-col :span="12">
        <div style="float: left">学员头像：</div>
        <el-avatar :src="encodeOssFileUri(member.avatar)" fit="cover" style="width: 100px;height: 100px" />
      </el-col>
      <el-col :span="12">学员昵称：{{ member.nickname }}</el-col>
      <el-col :span="12">学员手机：{{ member.mobile }}</el-col>
      <el-col :span="12">学员邮箱：{{ member.email }}</el-col>
    </el-row>
  </div>
</template>

<script>

import { getInfo as memberInfo } from '@/api/member'
import { getInfo as courseInfo } from '@/api/course'
import { encodeOssFileUri } from '@/utils'

export default {
  name: 'TrderDetails',
  data() {
    return {
      order: {},
      course: {},
      member: {}
    }
  },
  methods: {
    setData(data) {
      this.order = data
      this.getCourse()
      this.getMember()
    },
    encodeOssFileUri(ossUri) {
      return encodeOssFileUri(ossUri)
    },
    getCourse() {
      courseInfo(this.order.courseId).then(resp => {
        this.course = resp.data
      })
    },
    getMember() {
      memberInfo(this.order.memberId).then(resp => {
        this.member = resp.data
      })
    },
    getDetailsSubject(subjectParent) {
      let subject = ''
      let parent = subjectParent
      while (parent) {
        subject = `${parent.title} > ${subject}`
        parent = parent.parent
      }
      return subject.substring(0, subject.length - 3)
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

</style>
