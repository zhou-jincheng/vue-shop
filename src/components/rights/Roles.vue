<template>
  <div roles-container>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体卡片表格 -->
    <el-card>
      <!-- 头部按钮区域 -->
      <el-row class="add_roles">
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色列表 -->
      <el-row>
        <el-table :data="rolesList"
                  border
                  stripe>
          <!-- 可扩展权限视图 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 第一级权限 -->
              <el-row v-for="(right1, index) in scope.row.children"
                      :key="right1.id"
                      :class="{b_top: index === 0, b_bottom: true}"
                      align="middle"
                      type="flex">
                <el-col :span="6">
                  <el-tag type="primary"
                          closable
                          @close="delRightsByRoles(scope.row.id, right1.id)">{{right1.authName}}</el-tag>
                </el-col>
                <el-col :span="18">
                  <!-- 第二级权限 -->
                  <el-row　 v-for="(right2, index2) in right1.children"
                           :key="right2.id"
                           :class="{b_top: index2 !== 0}"
                           align="middle"
                           type="flex">
                    <el-col :span="5">
                      <el-tag type="success"
                              closable
                              @close="delRightsByRoles(scope.row.id, right2.id)">{{right2.authName}}</el-tag>
                    </el-col>
                    <el-col :span="19">
                      <!-- 第三层权限 -->
                      <el-tag type="warning"
                              closable
                              v-for="right3 in right2.children"
                              @close="delRightsByRoles(scope.row.id, right3.id)">{{right3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 非扩展表格数据区域 -->
          <el-table-column type="index"
                           label="#"></el-table-column>
          <el-table-column prop="roleName"
                           label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc"
                           label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="mini"
                         icon="el-icon-edit">编辑</el-button>
              <el-button type="danger"
                         size="mini"
                         icon="el-icon-delete">删除</el-button>
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-setting"
                         @click="showSetRightsDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRightsDialogVisible"
               width="50%">
      <el-tree ref="tree"
               :data="treeData"
               node-key="id"
               :props="treeProps"
               :default-checked-keys="checkedNodesArr"
               show-checkbox
               highlight-current
               default-expand-all>
      </el-tree>

      <span slot="footer">
        <el-button @click="setRightsDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="setRights">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 是否显示权限飞陪对话框
      setRightsDialogVisible: false,
      // 所有权限列表
      treeData: [],
      // 子节点和显示节点文本配置
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 被选中的节点的key集合
      checkedNodesArr: [],
      // 被选中权限分配的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      let { data: res } = await request('roles')
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error('角色列表获取失败！')
      this.rolesList = res.data
    },
    // 删除角色的权限
    async delRightsByRoles(roleId, rightId) {
      let confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(() => {})
      if (!confirm) return this.$message.error('取消删除成功！')
      let { data: res } = await request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete',
      })
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      let role = this.rolesList.find((role) => role.id == roleId)
      role.children = res.data
      this.$message.success('删除权限成功！')
    },
    // 展现分配权限页面对话框
    async showSetRightsDialog(role) {
      // console.log(role);
      // 保存被选中的角色id
      this.roleId = role.id
      // 获取所有权限列表
      let {data: res} = await request('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限列表失败！');
      this.treeData = res.data;
      // 清除选中节点数组
      this.checkedNodesArr = [],
      // 填充选中的节点数据
      this.getCheckedNodesArr(role.children)
      // console.log(this.checkedNodesArr);
      this.setRightsDialogVisible = true;
    },
    // 获取被选中的叶节点
    getCheckedNodesArr(arr = []){
      arr.forEach(item => {
        if(!item.children) return this.checkedNodesArr.push(item.id);
        this.getCheckedNodesArr(item.children)
      })
    },
    // 分配权限
    async setRights() {
      let checkedNodesArr = this.$refs.tree.getCheckedNodes(false,true);
      let rightsIdStr = checkedNodesArr.map(v => v.id).join(",");
      // console.log(rightsIdStr);
      let {data: res} =await request({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: {rids: rightsIdStr}
      });
      if(res.meta.status !== 200) return this.$message.error('分配权限失败！');
      this.setRightsDialogVisible = false;
      this.getRolesList();
      this.$message.success('分配权限成功！')
    }
  },
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-breadcrumb {
  font-size: 12px;
}
.el-row {
  padding: 0;
}
.b_top {
  border-top: 1px solid #eee;
}
.b_bottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px 10px;
}
.add_roles {
  margin-bottom: 20px;
}
</style>
