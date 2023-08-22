<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">
      <h3 class="title-container">项目管理平台</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model="loginForm.username" placeholder="请输入账号" tabindex="1" auto-complete="on" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="passwordType" :key="passwordType" v-model="loginForm.password" placeholder="请输入密码" tabindex="2"
          auto-complete="on" @keyup.enter="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="submitForm">登
        录</el-button>
    </el-form>
  </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { setSessionStorage } from '@/utils/index'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '17721064192',
        password: '4192'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    // 登录
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            cmd: "user_login",
            sid: "",
            data: {
              phone: this.loginForm.username,
              pwd: this.loginForm.password
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
            console.log(res);
            this.loading = false
            setSessionStorage('token', res.data.sid)
            setSessionStorage('userInfo', res.data.User)
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './login.scss';
</style>
<style lang="scss">
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 50px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 50px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #283443 inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #ddd;
    border-radius: 5px;
    color: #454545;
  }
}
</style>
