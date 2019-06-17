<template>
  <div>
    <!-- 路径导航，面包屑， -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索模块 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select searchBox"
        @keyup.enter.native="searchuser"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchuser"></el-button>
      </el-input>
      <el-button type="success" plain @click="getadduser = true">添加用户</el-button>
    </div>
    <!-- 添加用户模块 -->
    <el-dialog title="添加用户" :visible.sync="getadduser">
      <el-form :model="addUserForm" :rules="rules" ref="addUserForm" :label-width="'120px'">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="getadduser = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 数据展示模块 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end">
            <el-button type="success" icon="el-icon-share" @click="showGrantRoleDialog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="button">
      <!-- 添加分页结构 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 编辑弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="edituser" :rules="rules" ref="edituser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="edituser.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="edituser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="edituser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form :model="roleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="roleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="roleForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  updateUserStatuById,
  editUsers,
  delUserById,
  addUSer
} from '@/api/index.js'
import { getAllRoleList, grantRole } from '@/api/rolelist.js'
export default {
  data () {
    return {
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      total: 10,
      roleList: [],
      roleDialogFormVisible: false,
      formLabelWidth: '120px',
      editDialogFormVisible: false,
      rolesdata: [],
      edituser: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      roleForm: {
        id: '',
        username: '',
        rid: 30
      },
      getadduser: false,
      userstatu: true,
      query: '',
      pagenum: 1,
      pagesize: 3,
      userList: [],
      value: false,
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.init()
    },
    searchuser () {
      this.init()
    },
    addSubmit () {
      addUSer(this.addUserForm).then(result => {
        console.log(result)
        if (result.meta.status === 201) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
          this.getadduser = false
          this.init()
          this.$refs['addUserForm'].resetFields()
        }
      })
    },
    changeStatu (type, id) {
      updateUserStatuById(id, type).then(result => {
        console.log(result)
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
        }
      })
    },
    editSubmit () {
      this.$refs.edituser.validate(valid => {
        if (valid) {
          // 实现数据的再次验证
          // validdate可以实现指定表单的数据验证
          // 这个方法验证完毕之后会调用回调函数，这个回调函有一个参数
          // 这个参数是valid，它们就是是否通过验证的标识，如果通过验证就返回true，否则就返回false
          editUsers(this.edituser).then(result => {
            this.init()
            this.editDialogFormVisible = false
          })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    showEditDialog (data) {
      this.editDialogFormVisible = true
      this.edituser.id = data.id
      this.edituser.username = data.username
      this.edituser.email = data.email
      this.edituser.mobile = data.mobile
    },

    del (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(id).then(result => {
          if (result.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.init()
          } else {
            this.message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      })
    },
    showGrantRoleDialog (row) {
      this.roleDialogFormVisible = true
      this.roleForm.id = row.id
      this.roleForm.username = row.username
    },
    grantRoleSubmit () {
      grantRole(this.roleForm.id, this.roleForm.rid).then(result => {
        if (result.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.meta.msg
          })
          // 这里为什么需要刷新，因为你成功的修改的角色，页面中的数据列表并没有重新加载，会造成数据列表的中每一行数据所对应的scope.row没有变化，进而造成获取数据的时候数据源没有变化，所以进行刷新
          this.init()
          this.roleDialogFormVisible = false
        }
      })
    },
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        console.log(result)
        this.userList = result.data.users
        this.total = result.data.total
      })
    }
  },
  mounted () {
    this.init()
    getAllRoleList().then(result => {
      this.roleList = result.data
      console.log(this.roleList)
    })
  }
}
</script>
<style lang="less">
.searchBox {
  width: 300px;
  margin-right: 10px;
}
.button {
  margin-top: 30px;
}
</style>
