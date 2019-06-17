<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightList" stripe style="width: 100%">
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column  label="层级">
          <template slot-scope="scope">
             <span>{{scope.row.level | formdata}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllrightLis } from '@/api/rights-index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    formdata (level) {
      if (level === '0') {
        return '1级'
      } else if (level === '1') {
        return '2级'
      } else if (level === '2') {
        return '3级'
      }
    }
  },
  mounted () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      let result = await getAllrightLis('list')
      this.rightList = result.data.data
      console.log(result.data.data)
    }
  }
}
</script>
<style lang="less">
</style>
