<template>
  <div>
    <el-steps :active="activeName-0" finish-status="success" simple style="margin-top: 20px">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <el-tabs type="border-card">
      <el-form label-width="80px" style="height:365px">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          style="margin-top:30px"
          @tab-click="handleClick"
        >
          <el-tab-pane label="用户管理" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="cateList"
                :props="cateProps"
                change-on-select="true"
                @change="cateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="文件上传" name="1">
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :file-list="fileList"
              list-type="picture"
              :headers="setToken()"
              :on-success="uploadSucess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="2">
            <quill-editor
              v-model="goodsForm.goods_introduce"
              ref="myQuillEditor"
              :options="editorOption"
              style="height:330px"
              name="editor"
            ></quill-editor>
          </el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
        <el-button type="success" @click="addGoods">添加商品</el-button>
      </el-form>
    </el-tabs>
  </div>
</template>
<script>
import { getAllCategoriesList, addGoodInfo } from '@/api/goodes.js'
export default {
  data () {
    return {
      fileList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateList: [],
      activeName: '0',
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      //   富文本框的图标
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block']
          ]
        }
      }
    }
  },
  mounted () {
    getAllCategoriesList(3).then(result => {
      this.cateList = result.data.data
    })
  },
  methods: {
    async addGoods () {
      let result = await addGoodInfo(this.goodsForm)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        setTimeout(() => {
          this.$router.push({ name: 'Goods' })
        }, 1000)
      } else if (result.data.meta.status === 400) {
        this.$message({
          type: 'warning',
          message: result.data.meta.msg + '请查看分类列表'
        })
        setTimeout(() => {
          this.activeName = '0'
        }, 1000)
      }
    },
    setToken () {
      return { Authorization: localStorage.getItem('itcastpro_token') }
    },
    uploadSucess (response, file, fileList) {
      // 上传文件成功之后，需要将返回的临时文件的全路径添加到pics属性中
      this.goodsForm.pics.push({ pic: response.data.tmp_path })
    },
    cateChange (value) {
      this.goodsForm.goods_cat = value.join(',')
    },
    handleClick (obj) {
      console.log(obj)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
