<template>
  <div class="users-wrapper">
    <!-- 头部面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容"
                style="width: 360px"
                v-model="getUsersParams.query"
                @change="userSearch"
                clearable
                @clear="clearSearch">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="userSearch"></el-button>
      </el-input>
      <el-button type="primary"
                 @click="addUserVisible = true">添加用户</el-button>

      <!-- 表格显示区域 -->
      <el-table :data="userList"
                border
                style="width: 100%"
                stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username"
                         label="姓名"
                         width="180">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         width="180">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色"></el-table-column>
        <el-table-column prop="mg_state"
                         label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        content="编辑用户"
                        placement="top">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="删除用户"
                        placement="top">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页模块 -->
      <el-pagination :current-page="getUsersParams.pagenum"
                     :page-sizes="[2, 4, 6, 8]"
                     :page-size="getUsersParams.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="changeSize"
                     @current-change="changeCurrentPage"
                     @prev-click="lastPage"
                     @next-click="nextPage">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addUserVisible"
               width="50%"
               @close="closeUserDialog">
      <!-- 添加用户表单区域 -->
      <el-form :model="user"
               :rules="userRules"
               ref="userForm"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="user.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户"
               :visible.sync="editUserVisible"
               width="50%"
               @close="closeEditDialog">
      <!-- 编辑对话框主体表单区域 -->
      <el-form :model="editForm"
               ref="editForm"
               :rules="editUserRules"
               label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 编辑对话框底部区域 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               width="50%"
               @close="closeRoleDialog">
      <!-- 主体区域 -->
      <el-row>
        <span>当前的用户：</span>{{userInfo.username}}
      </el-row>
      <el-row>
        <span>当前的角色：</span>{{userInfo.role_name}}
      </el-row>
      <el-row>
        <span>分配新角色：</span>
        <el-select v-model="selectedRoleId"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in rolesList"
                     :key="item.id"
                     :label="item.roleName"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-row>

      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="setRole">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data() {
    // 自定义邮箱和手机规则
    var validateEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!regEmail.test(value)) return callback(new Error('请输入合法的邮箱'))
      callback()
    }
    var validateMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regMobile.test(value))
        return callback(new Error('请输入合法的手机号'))
      callback()
    }

    return {
      userList: [],
      // 获取用户列表参数
      getUsersParams: {
        // 搜索条件
        query: '',
        // 当前页数
        pagenum: 1,
        // 单个页面显示条数
        pagesize: 2,
      },
      // 总页数
      total: 0,
      state: true,
      addUserVisible: false,
      user: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //添加用户表单规则
      userRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      //编辑用户对话框是否显示
      editUserVisible: false,
      // 要显示在编辑区域的用户信息
      editForm: {},
      // 编辑表单验证规则
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      setRoleDialogVisible: false,
      // 选中的用户信息
      userInfo: {},
      // 角色列表
      rolesList: [],
      // 选中的角色
      selectedRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      let { data: res } = await request({
        url: 'users',
        params: this.getUsersParams,
      })
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 每页显示条目处理函数
    changeSize(page) {
      this.getUsersParams.pagesize = page
      this.getUserList()
    },
    // 当前页发生改变时
    changeCurrentPage(page) {
      this.getUsersParams.pagenum = page
      this.getUserList()
    },
    lastPage(page) {
      // console.log(page)
      this.changeCurrentPage(page)
    },
    nextPage(page) {
      this.changeCurrentPage(page)
    },
    // 更改用户状态
    async changeState(user) {
      let { id, mg_state: state } = user
      let { data: res } = await request({
        url: `users/${id}/stte/${state}`,
        method: 'put',
      })
      // console.log(res);
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error('更改用户状态失败！')
      }
    },
    // 搜索功能
    userSearch() {
      this.getUserList()
    },
    // 清除功能
    clearSearch() {
      this.getUserList()
    },
    // 取消添加用户对话框
    closeUserDialog() {
      // this.addUserVisible = false;
      this.$refs.userForm.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.userForm.validate(async (valid) => {
        if (!valid) return
        let { data: res } = await request({
          url: 'users',
          method: 'post',
          data: this.user,
        })
        // console.log(res);
        if (res.meta.status !== 201)
          return this.$message.error('添加用户失败！')
        this.$refs.userForm.resetFields()
        this.addUserVisible = false
        this.getUserList()
        this.$message.success('添加用户成功！')
      })
    },
    // 显示编辑用户对话框
    async showEditDialog(uid) {
      let { data: res } = await request('users/' + uid)
      // console.log(res);
      if (res.meta.status !== 200) {
        this.editUserVisible = false
        return this.$message.error('编辑用户信息失败！')
      }
      this.editForm = res.data
      this.editUserVisible = true
    },
    // 关闭编辑用户对话框回调函数
    closeEditDialog() {
      this.$refs.editForm.resetFields()
    },
    // 编辑用户信息
    editUserInfo() {
      // 先对表单进行校验
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        let { data: res } = await request({
          url: 'users/' + this.editForm.id,
          method: 'put',
          data: this.editForm,
        })
        //  console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error('更新用户信息失败！')
        this.editUserVisible = false
        this.getUserList()
        this.$message.success('更新用户成功！')
      })
    },
    // 根据用户id删除用户
    async removeUserById(uid) {
      let confirm = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(() => {
        this.$message.error('已取消删除！')
      })
      // console.log(confirm);
      if (!confirm) return
      let { data: res } = await request({
        url: 'users/' + uid,
        method: 'delete',
      })
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      if (this.total % this.getUsersParams.pagesize === 1)
        this.getUsersParams.pagenum -= 1
      this.getUserList()
      console.log(this.getUsersParams)
      console.log(this.total)
      this.$message.success('删除用户成功！')
    },
    // 展示用户更改角色对话框
    async showSetRoleDialog(role) {
      // 获取角色列表
      let { data: res } = await request('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      // console.log(role)
      this.userInfo = role
      this.setRoleDialogVisible = true
    },
    // 分配角色
    async setRole() {
      if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色！')
      let { data: res } = await request({
        url: `users/${this.userInfo.id}/role`,
        method: 'put',
        data: { rid: this.selectedRoleId },
      })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.setRoleDialogVisible = false
      this.getUserList()
      this.$message.success('分配角色成功！')
    },
    // 分配角色对话框关闭
    closeRoleDialog() {
      this.selectedRoleId = '',
      this.rolesList = []
    }
  },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  font-size: 12px;
}
.el-card {
  margin-top: 16px;
}
.el-button {
  margin-left: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.el-row {
  margin-top: 20px;
}
</style>
