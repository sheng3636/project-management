<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span>{{ userInfo.name }}，欢迎您</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="editPassClick">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="editPassVisi" :close-on-click-modal="false" :close-on-press-escape="false"
      :before-close="closeEditPassDialog" @close="closeEditPassDialog()" width="45%">
      <el-form ref="editPassForm" class="formBody" :model="editPassForm" :rules="editPassRules" label-width="80px"
        label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="nickName">
              <el-input v-model="userInfo.name" disabled placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="loginName">
              <el-input v-model="userInfo.phone" disabled placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旧密码" prop="old_pwd">
              <el-input v-model="editPassForm.old_pwd" placeholder="请输入旧密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新密码" prop="new_pwd">
              <el-input v-model="editPassForm.new_pwd" placeholder="请输入新密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="comfirm_pwd">
              <el-input v-model="editPassForm.comfirm_pwd" placeholder="请重新输入新密码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditPassDialog()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('editPassForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage, removeSessionStorage } from '@/utils/index'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { validatePassword } from '@/utils/validate'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userInfo: JSON.parse(getSessionStorage('userInfo')),
      editPassVisi: false,// 是否弹出修改密码弹窗
      // 修改密码表单
      editPassForm: {
        old_pwd: '',
        new_pwd: ''
      },
      // 新增编辑用户表单验证规则
      editPassRules: {
        old_pwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        new_pwd: [
          { required: true, validator: validatePassword, trigger: 'change' }
        ],
        comfirm_pwd: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 弹出修改密码弹窗
    editPassClick() {
      this.editPassVisi = true
    },
    // 关闭修改密码弹窗
    closeEditPassDialog() {
      this.editPassVisi = false
      this.$refs['editPassForm'].resetFields()
    },
    // 修改密码
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.editPassForm.old_pwd === this.editPassForm.new_pwd) {
            this.$message({
              message: '旧密码与新密码不得相同',
              type: 'warning'
            });
            return
          }
          if (this.editPassForm.new_pwd !== this.editPassForm.comfirm_pwd) {
            this.$message({
              message: '两次输入的密码不一致！',
              type: 'warning'
            });
            return
          }
          const params = {
            cmd: "user_changepwd",
            sid: getSessionStorage('token'),
            data: {
              old_pwd: this.editPassForm.old_pwd,
              new_pwd: this.editPassForm.new_pwd
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
            this.$message({
              message: '密码修改成功',
              type: 'success'
            });
            removeSessionStorage('userInfo')
            removeSessionStorage('token')
            this.$router.push(`/login`)
          })
        } else {
          return false
        }
      })
    },
    // 退出登录
    async logout() {
      this.$confirm('退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeSessionStorage('userInfo')
        removeSessionStorage('token')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          margin-left: 5px;
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

