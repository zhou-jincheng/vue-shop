<template>
  <div class="login_container">
    <div class="login_wrap">
      <!-- 头像部分 -->
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单 -->
      <el-form ref="loginFormRef" 
        :model="loginForm" 
        :rules="rules"
        label-width="0" 
        class="login_form">
        <el-form-item prop="username">
          <el-input 
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password">
          </el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {request} from '../network/request'

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆
    login() {
      this.$refs.loginFormRef.validate(async boolean => {
        if(!boolean) return;
        let {data: res} = await request({
          url: '/login',
          method: 'post',
          data: this.loginForm
        });
        // console.log(res);
        if(res.meta.status != 200) return this.$message.error("登陆失败！");
        this.$message.success("登陆成功！")
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.replace("/home")
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .login_wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 390px;
    height: 300px;
    background-color: #fff;

    .avatar {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ccc;
      }
    }
  }
}

.btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
}
</style>