<template>
  <div class="add_container">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部提示信息 -->
      <el-alert title="添加商品信息"
                type="info">
      </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200"
                :active="isActived - 0"
                finish-status="success"
                align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 添加商品表单 -->
      <el-form :model="addFormData"
               ref="addFormRef"
               :rules="addFormRules"
               label-width="100px"
               label-position="top">

        <!-- 左侧Tab栏 -->
        <el-tabs tab-position="left"
                 v-model="isActived"
                 :before-leave="beforeLeaveTab"
                 @tab-click="clickTab">
          <!-- 商品信息模块 -->
          <el-tab-pane label="用户管理"
                       name="0">
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addFormData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addFormData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addFormData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addFormData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <el-cascader :options="cateList"
                           v-model="addFormData.goods_cat"
                           clearable
                           :props="cateProps"
                           @change="changeCate">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数模块 -->
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item :label="item.attr_name"
                          v-for="item in manyCateData"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item2,index) in item.attr_vals"
                             :key="index"
                             :label="item2"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性模块 -->
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyCateData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品图片模块 -->
          <el-tab-pane label="商品图片"
                       name="3">
            <el-upload class="upload_img"
                       :headers="headersObj"
                       action="http://127.0.0.1:8888/api/private/v1/upload"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess"
                       list-type="picture">
              <el-button type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>

          <!-- 商品内容模块 -->
          <el-tab-pane label="商品内容"
                       name="4">
            <quill-editor v-model="addFormData.goods_introduce"/>
            <el-button class="add_btn" type="primary" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { request } from '../../network/request'
import _ from 'lodash'
export default {
  data() {
    return {
      // 添加表单数据
      addFormData: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: [],
      },
      // 添加表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
      // 商品分类列表
      cateList: [],
      // 当前选中的商品Id
      cateId: 0,
      // 分类选择器配置
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 哪个tab被激活
      isActived: '0',
      // 动态参数
      manyCateData: [],
      // 静态属性
      onlyCateData: [],
      //为上传文件指定请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      let { data: res } = await request('categories')
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表失败！')
      this.cateList = res.data
    },
    // 离开当前tab栏调用此函数
    beforeLeaveTab() {
      if (this.addFormData.goods_cat.length !== 3) {
        this.$message.error('请选择三级商品分类')
        return false
      }
    },
    // 选中当前商品分类时调用该函数
    changeCate() {
      if (this.addFormData.goods_cat.length === 3)
        this.cateId = this.addFormData.goods_cat[2]
    },
    // 获取动态参数（sel='many'）或静态属性（sel='only'）
    async getParamsList(sel = 'many') {
      let { data: res } = await request({
        url: `categories/${this.cateId}/attributes`,
        params: { sel },
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      if (sel === 'many') {
        res.data.map((item) => (item.attr_vals = item.attr_vals.split(' ')))
        this.manyCateData = res.data
      } else {
        this.onlyCateData = res.data
      }
    },
    // 点击tab触发此函数
    async clickTab() {
      if (this.isActived === '1') await this.getParamsList('many')
      if (this.isActived === '2') await this.getParamsList('only')
    },
    // 图片预览处理函数
    handlePreview() {
      console.log(this.imgFileList)
    },
    //图片移除处理函数
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addFormData.pics.findIndex(
        (item) => item.pic === filePath
      )
      this.addFormData.pics.splice(index, 1)
      this.$message.success('移除图片成功！')
    },
    // 图片上传成功调用此函数
    handleSuccess(response, file, fileList) {
      // console.log(response);
      if (response.meta.status !== 200)
        return this.$message.error('图片上传失败！')
      this.addFormData.pics.push({
        pic: response.data.tmp_path,
      })
      this.$message.success('图片上传成功！')
    },
    addGood() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return this.$message.error('请填写必填的表单项');
        let form = _.cloneDeep(this.addFormData);
        form.goods_cat = form.goods_cat.join(',');
        this.manyCateData.forEach(item => {
          let attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          };
          form.attrs.push(attr)
        });
        this.onlyCateData.forEach(item => {
          let attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          form.attrs.push(attr)
        })
        // console.log(form);
        let {data: res} = await request({
          url: 'goods',
          method: 'post',
          data: form
        });
        // console.log(res);
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success('添加商品成功！');
        this.$router.push('/home/goods');
      })
    }
  },
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-steps {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 20px;
}
.el-checkbox {
  margin: 5px 10px 0 0 !important;
}
.add_btn {
  margin-top: 15px;
}
</style>
