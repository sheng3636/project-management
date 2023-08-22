<template>
  <el-dialog title="新建项目" :visible.sync="addEditVisi" :close-on-click-modal="false"
    :close-on-press-escape="false" :before-close="dialogClose" width="40%">
    <el-form class="formBody" ref="addEditForm" :model="addEditForm" :rules="addEditFormRules" label-width="80px"
      label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="addEditForm.name" placeholder="请输入项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目描述" prop="descript">
            <el-input v-model="addEditForm.descript" placeholder="请输入项目描述" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit('addEditForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
  data() {
    return {
      // 表单验证规则
      addEditFormRules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: '请输入项目描述', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    addEditVisi: {
      type: Boolean,
      defalut: false
    },
    addEditForm: {
      type: Object,
      defalut: {}
    }
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗时向父组件发送一个事件
    dialogClose() {
      this.$refs.addEditForm.resetFields()
      this.$emit('dialogClose')
    },
    // 提交上传表单并清空表单
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            cmd: "project_create",
            sid: getSessionStorage('token'),
            data: {
              name: this.addEditForm.name,
              descript: this.addEditForm.descript
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
            this.dialogClose()
            this.$parent.queryTableList()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogBody {
  display: flex;
  justify-content: space-between;

  .bodyLeft {
    width: 44%;
    height: 500px;
    // background: rgba(242, 242, 242, 1);
  }

  .bodyRight {
    width: 54%;
    height: 500px;

    // background: rgba(242, 242, 242, 1);
    .treeLabel {
      padding: 0 15px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;

      span {
        margin-right: 4px;
        color: #F56C6C;
        font-weight: normal;
      }
    }

    .treeWrap {
      padding: 10px 0;
      max-height: 440px;
      overflow-y: auto;
    }
  }
}
</style>