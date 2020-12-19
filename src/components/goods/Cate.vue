<template>
  <div class="cate_container">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格区域 -->
      <tree-table ref="treeTable"
                  sum-text="sum"
                  index-text="#"
                  :data="catesList"
                  :columns="columns"
                  :stripe="false"
                  :border="true"
                  :show-index="true"
                  :tree-type="true"
                  :show-row-hover="false"
                  :expand-type="false"
                  :selection-type="false"
                  class="treeTable">
        <template slot="deleted"
                  scope="scope">
          <i style="color:lightgreen"
             class="el-icon-success"
             v-if="!scope.row.cat_deleted"></i>
          <i style="color:red"
             class="el-icon-error"
             v-else></i>
        </template>
        <template slot="sorted"
                  scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1"
                  type="success">二级</el-tag>
          <el-tag v-else
                  type="warning">三级</el-tag>
        </template>
        <template slot="operate"
                  scope="scope">
          {{scope.cat_id}}
          <el-button type="primary"
                     size="mini"
                     icon="el-icon-edit">编辑</el-button>
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 底部分页模块 -->
      <el-pagination @size-change="sizeChange"
                     @current-change="currentChange"
                     :current-page="queryParams.pagenum"
                     :page-sizes="[1, 5, 10, 20]"
                     :page-size="queryParams.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     background
                     :pager-count="5">
      </el-pagination>

    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%">
      <!-- 表单区域 -->
      <el-form :model="addForm"
               ref="addFormRef"
               :rules="addRules"
               label-width="100px">
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="addForm.cat_pid"
                       :options="parentCateList"
                       :props="cascaderProps"
                       :clearable="true"
                       ref="cascader"
                       @change="cascaderChange"></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addCate">确认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
export default {
  data() {
    return {
      // 商品分类列表
      catesList: [],
      // 父级分类列表
      parentCateList: [],
      // 查询商品分类列表条件
      queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类总条数
      total: 0,
      // 表格各项配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'deleted',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sorted',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
        },
      ],
      // 是否显示添加分类对话框
      addCateDialogVisible: false,
      // 添加分类表单数据
      addForm: {
        //分类父 ID
        cat_pid: 0,
        //分类名称
        cat_name: '',
        //分类当前层级
        cat_level: 0,
      },
      // 添加分类表单验证规则
      addRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
      },
      // 分类级别配置项
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_level',
        label: 'cat_name',
        children: 'children',
        // checkStrictly: true
      }
    }
  },
  created() {
    this.getCatesList()
  },
  methods: {
    // 获取商品分类列表
    async getCatesList() {
      let { data: res } = await request({
        url: 'categories',
        params: this.queryParams,
      })
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表失败！')
      this.catesList = res.data.result
      this.total = res.data.total
    },
    // 每页条数发生改变
    sizeChange(pageSize) {
      this.queryParams.pagesize = pageSize
      this.getCatesList()
    },
    //当前页发生改变
    currentChange(page) {
      this.queryParams.pagenum = page
      this.getCatesList()
    },
    // 展示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true;
    },
    // 获取父级分类列表
    async getParentCateList() {
      let {data: res} = await request({
        url: 'categories',
        params: {type: 2}
      });
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取父级分类失败！');
      this.parentCateList = res.data;
    },
    // 添加分类
    addCate() {
      // 当有选择父级分类时
      if(this.addForm.cat_pid !== 0) this.addForm.cat_level = this.addForm.cat_pid + 1;
      console.log(cat_pid)
    },
    cascaderChange(val) {
      this.$refs.cascader.dropDownVisible = false;  //地区选择之后将下拉框界面收起
      console.log(val);  //获取的id值['10001','10011']
    }
  },
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.treeTable {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
