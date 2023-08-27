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
                        <el-select v-model="editCardForm.owner_ids1" multiple placeholder="请选择负责人" style="width: 100%;"
                            @change="ownerChange($event, 1)" @remove-tag="ownerDel($event, 1)">
                            <el-option v-for="(item, index) in userOpts" :key="index" :label="item.name"
                                :value="item.uid"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="参与人" prop="joiner_ids">
                        <el-select v-model="editCardForm.joiner_ids1" multiple placeholder="请选择参与人" style="width: 100%;"
                            @change="ownerChange($event, 2)" @remove-tag="ownerDel($event, 2)">
                            <el-option v-for="(item, index) in userOpts" :key="index" :label="item.name"
                                :value="item.uid"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="关联文档">
                        <el-upload ref="upload" action="" :http-request="handleUpload">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                        </el-upload>
                        <ul class="field-list">
                            <li class="field-attach" v-for="(item, index) in editCardForm.doc_list" :key="index">
                                <img :src="require(`../../assets/${docuType(item.name)}.png`)" class="thumb">
                                <div>
                                    <div class="title">{{ item.name }}</div>
                                    <div class="creator">{{ item.Creator.name }}</div>
                                    <div class="creattime">{{ item.create_time }}</div>
                                </div>
                                <div class="action">
                                    <span class="icon"
                                        v-if="docuType(item.name) === 'tuPian' || docuType(item.name) === 'pdf'">
                                        <a id="new-page-link" :href="item.file_url" target="_blank">预览</a>
                                    </span>
                                    <span class="icon" @click="download(item)">下载</span>
                                    <span class="icon" @click="handleRemove(item)">删除</span>
                                </div>
                            </li>
                        </ul>
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
            editCardForm: {
            },
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
        editCardId: {
            type: String,
            defalut: ''
        }
    },
    mounted() {
        this.queryUserList()
        this.queryCardDetail()
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
        // 获取卡片详情
        queryCardDetail() {
            const params = {
                cmd: "card_detail",
                sid: getSessionStorage('token'),
                data: {
                    card_id: this.editCardId
                }
            }
            apiPost('/V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                const { data } = res
                let owner_ids = []
                for (let i = 0; i < data.owner_list.length; i++) {
                    const element = data.owner_list[i];
                    owner_ids[i] = element.uid
                }
                let joiner_ids = []
                for (let i = 0; i < data.joiner_list.length; i++) {
                    const element = data.joiner_list[i];
                    joiner_ids[i] = element.uid
                }
                // this.editCardForm = {
                //     card_id: val.card_id,
                //     name: val.name,
                //     begin_time: val.begin_time,
                //     end_time: val.end_time,
                //     descript: val.descript,
                //     priority: val.priority,
                //     owner_ids: owner_ids,
                //     owner_idsLength: owner_ids.length,
                //     joiner_ids: joiner_ids,
                //     joiner_idsLength: joiner_ids.length,
                //     doc_list: val.doc_list
                // }
                data.owner_ids1 = owner_ids
                data.owner_idsLength = owner_ids.length
                data.joiner_ids1 = joiner_ids
                data.joiner_idsLength = joiner_ids.length
                this.editCardForm = data
                console.log(data);
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
                            card_id: this.editCardId,
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
                            card_id: this.editCardId,
                            begin_time: this.editCardForm.begin_time ? this.editCardForm.begin_time : '',
                            end_time: this.editCardForm.end_time ? this.editCardForm.end_time : ''
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
                            card_id: this.editCardId,
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
                            card_id: this.editCardId,
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
                        card_id: this.editCardId,
                        type: type,
                        user_id: val[val.length - 1]
                    }
                }
                apiPost('/V2/index_prod.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.queryCardDetail()
                    this.editCardForm.owner_idsLength = val.length
                    this.editCardForm.joiner_idsLength = val.length
                })
            }
        },
        // 卡片删除负责人、参与人
        ownerDel(val, type) {
            const params = {
                cmd: "card_userdel",
                sid: getSessionStorage('token'),
                data: {
                    card_id: this.editCardId,
                    type: type,
                    user_id: val
                }
            }
            apiPost('/V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                this.queryCardDetail()
                this.editCardForm.owner_idsLength = this.editCardForm.owner_ids1.length
                this.editCardForm.joiner_idsLength = this.editCardForm.joiner_ids1.length
            })
        },
        // 卡片关联文档
        handleUpload(res) {
            console.log(res);
            var file = res.file;
            const formData = new FormData()
            const params = {
                cmd: "card_docupload",
                sid: getSessionStorage('token'),
                data: {
                    card_id: this.editCardId
                }
            }
            formData.append('json', JSON.stringify(params))
            formData.append('uploadfile', file)
            apiPost('/V2/index_prod.php', {
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then((resp) => {
                this.$message({
                    message: '上传成功',
                    type: 'success'
                });
                this.$parent.queryTableList()
                this.queryCardDetail()
            })
        },
        // 卡片关联文档删除
        handleRemove(val) {
            this.$confirm('确定删除该附件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                    cmd: "card_docdel",
                    sid: getSessionStorage('token'),
                    data: {
                        doc_id: val.doc_id
                    }
                }
                apiPost('/V2/index_prod.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((resp) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.$parent.queryTableList()
                    this.queryCardDetail()
                })
            })
        },
        // 下载附件
        async download(val) {
            const link = document.createElement('a')
            // 这里是将链接地址url转成blob地址，
            fetch(val.file_url).then(res => res.blob()).then(blob => {
                link.href = URL.createObjectURL(blob)
                // 下载文件的名称及文件类型后缀
                link.download = val.name
                document.body.appendChild(link)
                link.click()
                // 在资源下载完成后 清除 占用的缓存资源
                window.URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
            })
        },
        // 文档类型区分
        docuType(val) {
            let typeArr = val.split('.')
            let type = typeArr[typeArr.length - 1].toLowerCase()
            if (type === 'jpeg' || type === 'jpg' || type === 'png' || type === 'gif') {
                return 'tuPian'
            } else if (type === 'docx' || type === 'doc') {
                return 'word'
            } else if (type === 'xls' || type === 'xlsx') {
                return 'excel'
            } else if (type === 'ppt' || type === 'pptx') {
                return 'ppt'
            } else if (type === 'pdf') {
                return 'pdf'
            } else if (type === 'rar' || type === 'zip' || type === 'jar' || type === 'arj') {
                return 'package'
            } else {
                return 'unknow'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.formBody {
    max-height: 610px;
    overflow-y: auto;
}

.field-list {
    .field-attach {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        width: 100%;
        margin-bottom: 15px;
    }

    .thumb {
        position: relative;
        margin-right: 10px;
        line-height: 58px;
        width: 58px;
        height: 58px;
        overflow: hidden;
        text-align: center;
    }

    .title {
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .creator,
    .creattime {
        display: inline-block;
        margin-right: 15px;
        font-size: 12px;
        color: #999;
        vertical-align: top;
    }

    .action {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);

        .icon {
            display: inline-block;
            margin-right: 10px;
            font-size: 14px;
            color: #444;
            cursor: pointer;
        }
    }
}
</style>