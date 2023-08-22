<template>
    <el-dialog title="编辑卡片" :visible.sync="editCardVisi" :close-on-click-modal="false" :close-on-press-escape="false"
        :before-close="editCardDialog" width="60%">
        <el-form class="formBody" ref="editCardForm" :model="editCardForm" :rules="editCardFormRules" label-width="80px"
            label-position="top">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="标题" prop="name">
                        <el-input v-model="editCardForm.name" placeholder="请输入标题" @change="nameChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" prop="date">
                        <el-date-picker v-model="editCardForm.begin_time" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择开始时间" style="width: 100%;" @change="timeChange">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束时间" prop="date">
                        <el-date-picker v-model="editCardForm.end_time" type="date" value-format="yyyy-MM-dd"
                            placeholder="请选择结束时间" style="width: 100%;" @change="timeChange">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="描述" prop="descript">
                        <el-input v-model="editCardForm.descript" placeholder="请添加描述" @change="descriptChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="优先级" prop="priority">
                        <el-select v-model="editCardForm.priority" placeholder="请选择优先级" style="width: 100%;"
                            @change="priorityChange">
                            <el-option v-for="(item, index) in priorityOpts" :key="index" :label="item.name"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="负责人" prop="owner_ids">
                        <el-select v-model="editCardForm.owner_ids" multiple placeholder="请选择负责人" style="width: 100%;"
                            @change="ownerChange($event, 1)" @remove-tag="ownerDel($event, 1)">
                            <el-option v-for="(item, index) in userOpts" :key="index" :label="item.name"
                                :value="item.uid"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="参与人" prop="joiner_ids">
                        <el-select v-model="editCardForm.joiner_ids" multiple placeholder="请选择参与人" style="width: 100%;"
                            @change="ownerChange($event, 2)" @remove-tag="ownerDel($event, 2)">
                            <el-option v-for="(item, index) in userOpts" :key="index" :label="item.name"
                                :value="item.uid"></el-option>
                        </el-select>
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
            editCardFormRules: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
            }
        }
    },
    props: {
        editCardVisi: {
            type: Boolean,
            defalut: false
        },
        editCardForm: {
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
        editCardDialog() {
            this.$refs.editCardForm.resetFields()
            this.$emit('editCardDialog')
        },
        // 提交修改卡片名称表单
        nameChange() {
            this.$refs.editCardForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "card_nameset",
                        sid: getSessionStorage('token'),
                        data: {
                            card_id: this.editCardForm.card_id,
                            name: this.editCardForm.name
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
        // 提交修改卡片日期表单
        timeChange() {
            this.$refs.editCardForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "card_timeset",
                        sid: getSessionStorage('token'),
                        data: {
                            card_id: this.editCardForm.card_id,
                            begin_time: this.editCardForm.begin_time,
                            end_time: this.editCardForm.end_time
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
        // 提交修改卡片优先级表单
        priorityChange() {
            this.$refs.editCardForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "card_priorityset",
                        sid: getSessionStorage('token'),
                        data: {
                            card_id: this.editCardForm.card_id,
                            priority: this.editCardForm.priority
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
        // 提交修改卡片描述表单
        descriptChange() {
            this.$refs.editCardForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "card_descset",
                        sid: getSessionStorage('token'),
                        data: {
                            card_id: this.editCardForm.card_id,
                            descript: this.editCardForm.descript
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
        // 卡片添加负责人、参与人
        ownerChange(val, type) {
            if (val.length > this.editCardForm.owner_idsLength) {
                const params = {
                    cmd: "card_useradd",
                    sid: getSessionStorage('token'),
                    data: {
                        card_id: this.editCardForm.card_id,
                        type: type,
                        user_id: val[val.length - 1]
                    }
                }
                apiPost('/V2/index_prod.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.$parent.queryTableList()
                    this.editCardForm.owner_idsLength = val.length
                    this.editCardForm.joiner_idsLength = val.length
                })
            }
        },
        // 卡片删除负责人、参与人
        ownerDel(val, type) {
            console.log(val);
            const params = {
                cmd: "card_userdel",
                sid: getSessionStorage('token'),
                data: {
                    card_id: this.editCardForm.card_id,
                    type: type,
                    user_id: val
                }
            }
            apiPost('/V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                this.$parent.queryTableList()
                this.editCardForm.owner_idsLength = this.editCardForm.owner_ids.length
                this.editCardForm.joiner_idsLength = this.editCardForm.joiner_ids.length
            })
        }
    }
}
</script>