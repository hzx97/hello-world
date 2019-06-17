<template>
  <div>
    <!-- 路径导航，面包屑， -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户按钮 -->
    <el-button type="success" plain @click="getaddrole = true">添加角色</el-button>
    <!-- 添加角色模块 -->
    <el-dialog title="添加用户" :visible.sync="getaddrole">
      <el-form :model="addRoleForm" :rules="rules" ref="addRoleForm" :label-width="'120px'">
        <el-form-item label="角色名字" prop="rolename">
          <el-input v-model="addRoleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述信息" prop="xinxi">
          <el-input v-model="addRoleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="getaddrole = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 数据展示模块 -->
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="rolelist in scope.row.children"
            :key="rolelist.id"
            style="margin-top:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag
                  closable
                  :type="'success'"
                  @close="removeSingleRight(scope.row,rolelist.id)"
                >{{rolelist.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <el-row
                  v-for="second in rolelist.children"
                  :key="second.id"
                  style="margin-bottom:15px"
                >
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'info'"
                        @close="removeSingleRight(scope.row,second.id)"
                        style="margin-right:5px;margin-bottom:15px"
                      >{{second.authName}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="18">
                    <div class="grid-content bg-purple">
                      <div class="grid-content bg-purple">
                        <el-tag
                          closable
                          :type="'warning'"
                          v-for="third in second.children"
                          :key="third.id"
                          style="margin-right:5px;margin-bottom:15px"
                          @close="removeSingleRight(scope.row,third.id)"
                        >{{third.authName}}</el-tag>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有任何的权限，请先分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="姓名" width="350"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="350"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-end">
            <el-button
              type="success"
              class="el-icon-s-check"
              @click="showDialogFormVisible(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 消息提示 -->
    <el-button :plain="true"></el-button>
    <!-- 角色授权区域 -->
    <el-dialog title="角色授权" :visible.sync="DialogFormVisible">
      <div class="rightListBox">
        <el-tree
          ref="rightTree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all="false"
          :default-checked-keys="selectedKeys"
          :props="defaultProps"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoleList,
  removeRightByUserId,
  addRoleSubmit,
  getroleright,
  grantRoleSubmit
} from '@/api/rolelist.js'
export default {
  data () {
    return {
      roleId: '',
      rightList: [],
      selectedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      DialogFormVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      getaddrole: false,
      msg: '',
      roleList: []
    }
  },
  mounted () {
    this.Agetrolelist()
  },
  methods: {
    async showDialogFormVisible (row) {
      this.roleId = row.id
      // 显示权限列表对话框
      this.DialogFormVisible = true
      // 获取所有权限列表数据
      let result = await getroleright('tree ')
      // 动态渲染该数据到权限列表对话框中
      this.rightList = result.data.data
      // 为了每次打开不同的对话框都是这个角色应该有的权限，需要重置这个上次已填充的数据
      this.selectedKeys = []
      // 此时数据只是取到渲染整个结构，但是角色应有应加载的权限并未加载，这个时候需要遍历，
      // 遍历这函数getroleright取回的数据。取出第三级children的id，然后push到selectedKeys这个数组中，这样就能让树状表单填充默认的有的权限了

      // 我们要获取的其实是三级权限所对应的id,树有一个特点，如果子节点被选择，父节点默认就会被展开
      // 我们这里所要获取的权限id是这个角色所拥有的权限，而不能直接通过Result进行获取
      // row:就是当前这一行数据所对应的数据对象，这个数据对象中就包含着这个角色所拥有的权限数据
      // 在新的角色权限获取之前，将上一个角色的权限数据清除
      if (row.children && row.children.length > 0) {
        row.children.forEach(rolelist => {
          if (rolelist.children && rolelist.children.length > 0) {
            rolelist.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.selectedKeys.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    async grantRoleSubmit () {
      var allNodes = this.$refs.rightTree.getCheckedNodes()

      var arr = allNodes.map(value => {
        return value.id + ',' + value.pid
      })
      var ids = arr.join(',')
      var temp = ids.split(',')
      var finalIds = Array.from(new Set(temp))
      let result = await grantRoleSubmit(this.roleId, finalIds.join(','))
      if (result.data.meta.status === 200) {
        this.$message({
          showClose: true,
          message: result.data.meta.msg,
          type: 'success'
        })
        this.DialogFormVisible = false
        this.Agetrolelist()
      } else {
        this.$message({
          showClose: true,
          message: result.data.meta.msg,
          type: 'success'
        })
      }
    },
    async addSubmit () {
      let result = await addRoleSubmit(this.addRoleForm)
      if (result.data.meta.status === 201) {
        this.$message({
          showClose: true,
          message: result.data.meta.msg,
          type: 'success'
        })
        this.Agetrolelist()
        this.getaddrole = false
      }
    },
    async removeSingleRight (row, rightid) {
      let result = await removeRightByUserId(row.id, rightid)
      row.children = result.data.data
      if (result.data.meta.status === 200) {
        this.$message({
          showClose: true,
          message: result.data.meta.msg,
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: result.data.meta.msg,
          type: 'warning'
        })
      }
    },
    async Agetrolelist () {
      let result = await getAllRoleList()
      this.roleList = result.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
