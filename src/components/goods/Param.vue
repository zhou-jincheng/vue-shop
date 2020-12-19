<template>
  <div class="param_container">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体卡片区域 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false">
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row class="chooseCateBox">
        <span>选择商品分类：</span>
        <el-cascader v-model="cateAry"
                     :options="cateList"
                     :props="cascaderProps"
                     @change="handleCateChange">
        </el-cascader>
      </el-row>

      <!-- 动态参数和静态属性的管理tabs栏 -->
      <el-tabs v-model="activedTab"
               @tab-click="handleTabClick">
        <!-- 动态参数部分 -->
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     size="mini"
                     :disabled="cateAry.length !== 3"
                     @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="paramsTableData"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="item"
                        closable
                        @close="delTagById(scope.row,index)">{{item}}</el-tag>
                <!-- 添加标签部分 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="delParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性部分 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     size="mini"
                     :disabled="cateAry.length !== 3"
                     @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="paramsTableData"
                    border
                    stripe>
            <!-- 扩展行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="item"
                        closable
                        @close="delTagById(scope.row,index)">{{item}}</el-tag>
                <!-- 添加标签部分 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="delParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog :title="'添加'+dialogTitle"
               :visible.sync="addDialogVisible"
               width="50%"
               @close="addFormColsed">

      <!-- 添加表单 -->
      <el-form ref="addFormRef"
               :model="addFormData"
               label-width="80px"
               :rules="addFormRules">
        <el-form-item :label="dialogTitle"
                      prop="attr_name">
          <el-input v-model="addFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addParam">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog :title="'修改'+dialogTitle"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editFormColsed">

      <!-- 添加表单 -->
      <el-form ref="editFormRef"
               :model="editFormData"
               label-width="80px"
               :rules="editFormRules">
        <el-form-item :label="dialogTitle"
                      prop="attr_name">
          <el-input v-model="editFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="editParam">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data() {
    return {
      cateList: [],
      // 选中商品分类的数组
      cateAry: [],
      // 选中的商品分类id
      cateId: 0,
      // 商品分类配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中选项卡的 name
      activedTab: 'many',
      // tabs表格显示数据
      paramsTableData: [],
      // 添加对话框是否显示
      addDialogVisible: false,
      // 编辑对话框是否显示
      editDialogVisible: false,
      // 添加表单数据
      addFormData: {
        attr_name: '',
      },
      // 编辑表单数据
      editFormData: {
        attr_name: '',
        attr_id: 0,
      },
      // 添加表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      // 添加表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    // 根据哪个标签tab被激活来确定添加对话框的标题
    dialogTitle() {
      if (this.activedTab === 'many') return '动态参数'
      return '静态属性'
    },
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      let { data: res } = await request('categories')
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表失败！')
      this.cateList = res.data
    },
    // 选中商品分类后会调用这个函数
    handleCateChange() {
      if (this.cateAry.length === 3) {
        this.cateId = this.cateAry[2]
      }
      this.getParamList()
    },
    // tabs栏被点击时调用此函数
    handleTabClick() {
      this.getParamList()
    },
    // 获取参数列表
    async getParamList() {
      if (!this.cateId) return
      let { data: res } = await request({
        url: `categories/${this.cateId}/attributes`,
        params: { sel: this.activedTab },
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取参数列表失败！')
      res.data.map((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //自己独有的编辑增添标签输入框是否显示
        item.inputVisible = false;
        //自己独有的增添标签内容
        item.inputValue = ''
      })
      console.log(res)
      this.paramsTableData = res.data
    },
    // 添加对话框关闭时调用该函数
    addFormColsed() {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑对话框关闭时调用该函数
    editFormColsed() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加参数或属性
    addParam() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        let { data: res } = await request({
          url: `categories/${this.cateId}/attributes`,
          method: 'post',
          data: {
            attr_name: this.addFormData.attr_name,
            attr_sel: this.activedTab,
          },
        })
        // console.log(res);
        if (res.meta.status !== 201) this.$message.error('添加参数或属性失败！')
        this.addDialogVisible = false
        this.getParamList()
        this.$message.success('添加成功！')
      })
    },
    // 修改参数或属性
    editParam() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        let { data: res } = await request({
          url: `categories/${this.cateId}/attributes/${this.editFormData.attr_id}`,
          method: 'put',
          data: {
            attr_name: this.editFormData.attr_name,
            attr_sel: this.activedTab,
          },
        })
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('更新失败！')
        this.getParamList()
        this.editDialogVisible = false
        this.$message.success('更新成功！')
      })
    },
    // 显示编辑对话框
    async showEditDialog(attrId) {
      let { data: res } = await request({
        url: `categories/${this.cateId}/attributes/${attrId}`,
        data: { attr_sel: this.activedTab },
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取' + this.dialogTitle + '失败！')
      this.editFormData.attr_name = res.data.attr_name
      this.editFormData.attr_id = res.data.attr_id
      this.editDialogVisible = true
    },
    // 删除参数
    async delParam(attrId) {
      let confirm = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => {
        console.log(error)
      })
      if (!confirm) return this.$message.info('取消删除成功！')
      let { data: res } = await request({
        url: `categories/${this.cateId}/attributes/${attrId}`,
        method: 'delete',
      })
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.getParamList()
      this.$message.success('删除成功！')
    },
    // 添加标签时会触发此函数
    handleInputConfirm(row) {
      // 无输入内容
      if(row.inputValue.trim().length === 0){
        row.inputValue = '';
        row.inputVisible = false;
        return
      }
      //有输入内容时添加标签
      if(row.attr_vals.includes(row.inputValue)) return this.$message.error('标签已经存在！');
      row.attr_vals.push(row.inputValue.trim());
      let res = this.syncTagsDatabase(row);
      if(!res) this.$message.error('添加失败！');
      row.inputValue = '';
      row.inputVisible = false;
      this.$message.success('添加成功！')
    },
    // 同步标签到数据库中
    async syncTagsDatabase(row){
      let {data: res} = await request({
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        method: 'put',
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activedTab,
          attr_vals: row.attr_vals.join(' ')
        }
      });
      if(res.meta.status !==200) return false;
      return true;
    },
    // 点击添加标签按钮显示输入框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
          this.$refs.saveTagInputRef.$refs.input.focus();
      });
    },
    // 删除标签
    async delTagById(row, index) {
      let confirm =await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(error => console.log(error));
      if(!confirm) return this.$message.info('取消删除成功！');
      row.attr_vals.splice(index, 1)
      let res = this.syncTagsDatabase(row);
      if(!res) return this.$message.error('删除失败！');
      this.$message.success('删除成功！')
    }
  },
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  font-size: 12px;
}
.el-card {
  margin-top: 20px;
}
.chooseCateBox {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin-right: 15px;
  margin-bottom: 10px;
}
.input-new-tag {
  width: 90px;
}
</style>
