<template>
  <el-dialog title="项目详情" :visible.sync="editProjectVisi" v-if="editProjectVisi" :close-on-click-modal="false" :close-on-press-escape="false"
    :before-close="editProjectClose" width="40%">
    <el-form class="formBody" ref="editProjectForm" :model="editProjectForm" :rules="editProjectFormRules"
      label-width="80px" label-position="top">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="editProjectForm.name" placeholder="请输入项目名称" @change="nameChange" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人" prop="name">
            <el-input v-model="editProjectForm.Creator.name" placeholder="请输入项目名称" disabled @change="nameChange" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目描述" prop="descript">
            <el-input v-model="editProjectForm.descript" placeholder="请输入项目描述" @change="descriptChange" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="date">
            <el-date-picker v-model="editProjectForm.create_time" type="date" value-format="yyyy-MM-dd"
              placeholder="请选择创建时间" style="width: 100%;" disabled>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="date">
            <el-date-picker v-model="editProjectForm.begin_time" type="date" value-format="yyyy-MM-dd"
              placeholder="请选择开始时间" style="width: 100%;" @change="timeChange">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="date">
            <el-date-picker v-model="editProjectForm.end_time" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间"
              style="width: 100%;" @change="timeChange">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目状态" prop="status">
              <el-switch v-model="editProjectForm.status" active-value="2" inactive-value="1" active-text="已完成" inactive-text="进行中" :disabled="editProjectForm.status === '2'" @change="statusChange"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
  data() {
    return {
      // 表单验证规则
      editProjectFormRules: {
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
    editProjectVisi: {
      type: Boolean,
      defalut: false
    },
    editProjectForm: {
      type: Object,
      defalut: {}
    }
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗时向父组件发送一个事件
    editProjectClose() {
      this.$refs.editProjectForm.resetFields()
      this.$emit('editProjectClose')
    },
    // 提交修改项目名称表单
    nameChange() {
      this.$refs.editProjectForm.validate(valid => {
        if (valid) {
          const params = {
            cmd: "project_nameset",
            sid: getSessionStorage('token'),
            data: {
              project_id: this.editProjectForm.project_id,
              name: this.editProjectForm.name
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
            this.$parent.queryTableList()
          })
        } else {
          return false
        }
      })
    },
    // 提交修改项目描述表单
    descriptChange() {
      this.$refs.editProjectForm.validate(valid => {
        if (valid) {
          const params = {
            cmd: "project_descset",
            sid: getSessionStorage('token'),
            data: {
              project_id: this.editProjectForm.project_id,
              descript: this.editProjectForm.descript
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
            this.$parent.queryTableList()
          })
        } else {
          return false
        }
      })
    },
    // 提交修改项目日期表单
    timeChange() {
      this.$refs.editProjectForm.validate(valid => {
        if (valid) {
          const params = {
            cmd: "project_timeset",
            sid: getSessionStorage('token'),
            data: {
              project_id: this.editProjectForm.project_id,
              begin_time: this.editProjectForm.begin_time,
              end_time: this.editProjectForm.end_time
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
            this.$parent.queryTableList()
          })
        } else {
          return false
        }
      })
    },
    // 提交项目完成请求
    statusChange() {
      this.$refs.editProjectForm.validate(valid => {
        if (valid) {
          const params = {
            cmd: "project_complete",
            sid: getSessionStorage('token'),
            data: {
              project_id: this.editProjectForm.project_id
            }
          }
          apiPost('/V2/index_prod.php', {
            data: {
              json: JSON.stringify(params)
            }
          }).then((res) => {
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