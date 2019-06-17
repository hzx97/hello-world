<template>
  <div class="list">
    <div style="margin-top: 15px;" class="lista">
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select searchBox"
        @keyup.enter.native="searchuser"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchuser"></el-button>
      </el-input>
      <el-button type="success" plain @click="$router.push({name:'Add'})">添加商品</el-button>
    </div>
    <!-- 数据展示模块 -->
     <el-table :data="roodsList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="560"></el-table-column>
      <el-table-column prop="goods_price" label="价格" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { Gettradelist } from '@/api/goodes.js'
export default {
  data () {
    return {
      query: '',
      pagenum: '1',
      pagesize: '20',
      roodsList: []
    }
  },
  mounted () {
    Gettradelist({ query: this.query,
      pagenum: this.pagenum,
      pagesize: this.pagesize })
      .then(result => {
        this.roodsList = result.data.data.goods
      })
  },
  methods: {
    searchuser () {
      Gettradelist({ query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize })
        .then(result => {
          this.roodsList = result.data.data.goods
        })
    }
  }
}
</script>
<style lang='less' scoped>

</style>
