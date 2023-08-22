<template>
    <el-dialog title="创建卡片" :visible.sync="addCardVisi" v-if="addCardVisi" :close-on-click-modal="false"
        :close-on-press-escape="false" :before-close="addCardDialog" width="40%">
        <el-form class="formBody" ref="addCardForm" :model="addCardForm" :rules="addCardFormRules" label-width="80px"
            label-position="top">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="标题" prop="name">
                        <el-input v-model="addCardForm.name" placeholder="请输入标题" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开始时间" prop="date">
                        <el-date-picker v-model="addCardForm.begin_time" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始时间" style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结束时间" prop="date">
                        <el-date-picker v-model="addCardForm.end_time" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="优先级" prop="priority">
                        <el-select v-model="addCardForm.priority" placeholder="请选择优先级" style="width: 100%;">
                            <el-option v-for="(item, index) in priorityOpts" :key="index" :label="item.name"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="负责人" prop="owner_ids">
                        <el-select v-model="addCardForm.owner_ids" multiple placeholder="请选择负责人" style="width: 100%;">
                            <el-option v-for="(item, index) in userOpts" :key="index" :label="item.name"
                                :value="item.uid"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCardDialog">取 消</el-button>
            <el-button type="primary" @click="onSubmit('addCardForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
    data() {
        return {
            priorityOpts: [
                {
                    name: '无',
                    value: '0'
                }, {
                    name: '低',
                    value: '1'
                }, {
                    name: '中',
                    value: '2'
                }, {
                    name: '高',
                    value: '3'
                }
            ],
            userOpts: [],// 用户列表
            // 表单验证规则
            addCardFormRules: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
            }
        }
    },
    props: {
        addCardVisi: {
            type: Boolean,
            defalut: false
        },
        addCardForm: {
            type: Object,
            defalut: {}
        }
    },
    mounted() {
        this.queryUserList()
    },
    methods: {
        // 获取用户列表
        queryUserList() {
            const params = {
                cmd: "user_list",
                sid: getSessionStorage('token'),
                data: {
                    name: ''
                }
            }
            apiPost('/V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                const { data } = res
                this.userOpts = data.list
            })
        },
        // 关闭弹窗时向父组件发送一个事件
        addCardDialog() {
            this.$refs.addCardForm.resetFields()
            this.$emit('addCardDialog')
        },
        // 提交上传表单并清空表单
        onSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "card_create",
                        sid: getSessionStorage('token'),
                        data: {
                            project_id: this.$route.params.id,
                            module_id: this.addCardForm.module_id,
                            name: this.addCardForm.name,
                            begin_time: this.addCardForm.begin_time,
                            end_time: this.addCardForm.end_time,
                            priority: this.addCardForm.priority,
                            owner_ids: this.addCardForm.owner_ids.join(';'),
                        }
                    }
                    apiPost('/V2/index_prod.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        this.addCardDialog()
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