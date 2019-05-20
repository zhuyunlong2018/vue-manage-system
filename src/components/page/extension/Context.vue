<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 推广内容</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" class="handle-del mr10" @click="handleAdd">添加草稿内容</el-button>
            </div>
            <el-tabs v-model="message">
                <el-tab-pane :label="`当前推广内容(${normal.length})`" name="first">
                    <el-table :data="normal" :show-header="false" style="width: 100%">
                        <el-table-column prop="group_name" width="150"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="handleEdit(scope.row)">{{scope.row.content}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="update_time" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button type="danger" size="small" @click="handleDel(scope.$index)">归入弃用栏</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleDraft(scope.$index)">归入草稿栏</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`草稿内容(${draft.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="draft" :show-header="false" style="width: 100%">
                            <el-table-column prop="group_name" width="150"></el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="handleEdit(scope.row)">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="update_time" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleNormal(scope.$index)">启用</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`已弃用内容(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column prop="group_name" width="150"></el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="handleEdit(scope.row)">{{scope.row.content}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="update_time" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="添加/编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="所属分组">
                    <el-select v-model="form.group_id" placeholder="请选择">
                        <el-option v-for="group in extensionGroups"  :key="group.id" :label="group.name" :value="group.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" rows="5" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getGroups } from '@/api/group'
    import { getContents, add, edit, changeStatus } from '@/api/extensionContext'
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                editVisible: false,
                extensionGroups: [],
                form: {},
                normal: [],
                draft: [],
                recycle: []
            }
        },
        created() {
            this.resetForm()
            this.getExtensionGroups()
            this.getList()
        },
        methods: {
            resetForm() {
                this.form = {
                    id: 0,
                    content: '',
                    group_id: '',
                    group_name: ''
                }
                this.idx = -1
            },
            handleNormal(index) {
                const item = this.draft.splice(index, 1)
                this.changeStatus(
                    item[0], 1,
                    () => { this.normal = item.concat(this.normal) },
                    () => { this.draft = item.concat(this.draft) }
                )
                
            },
            handleDel(index) {
                const item = this.normal.splice(index, 1)
                this.changeStatus(
                    item[0], 2,
                    () => { this.recycle = item.concat(this.recycle) },
                    () => { this.normal = item.concat(this.normal) }
                )
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1)
                this.changeStatus(
                    item[0], 1,
                    () => { this.normal = item.concat(this.normal) },
                    () => { this.recycle = item.concat(this.recycle) }
                )
            },
            handleDraft(index) {
                const item = this.normal.splice(index, 1)
                this.changeStatus(
                    item[0], 0,
                    () => { this.draft = item.concat(this.draft) },
                    () => { this.normal = item.concat(this.normal) }
                )
            },
            handleAdd() {
                this.resetForm()
                this.editVisible = true
            },
            handleEdit(row) {
                this.form = row
                this.editVisible = true
            },
            changeStatus(row, status, success, fail) {
                const data = {
                    id: row.id,
                    group_id: row.group_id,
                    status
                }
                changeStatus(data).then(response => {
                    success()
                })
                .catch(error => {
                    fail()
                })
            },
            // 保存编辑
            saveEdit() {
                if (this.form.id > 0) {
                    //编辑
                    edit(this.form).then(response => {
                        this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
                        let arr
                        switch(this.form.status) {
                            case 0:
                                arr = this.draft
                                break;
                            case 1:
                                arr = this.normal.push(element)
                                break;
                            case 2:
                                arr = this.recycle.push(element)
                        }
                        arr.forEach(element => {
                            if( element.id === this.form.id) {
                                element = this.form
                            }
                        })
                        this.editVisible = false
                    })
                    .catch(error => {
                        console.log(error)
                    })
                } else {
                    //添加
                    add(this.form).then(response => {
                        this.form.id = response
                        this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
                        this.draft.push(this.form)
                        this.editVisible = false
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            },
            getGroupNameByGroupId(groupId) {
                for( const element of this.extensionGroups) {
                    if (element.id === this.form.group_id) {
                        return element.name
                    }
                }
            },
            getExtensionGroups() {
                getGroups({pid: 2}).then(response => {
                    this.extensionGroups = response
                })
                .catch(error => {
                    console.log(error)
                })
            },
            getList() {
                getContents().then(response => {
                    response.forEach(element => {
                        switch(element.status) {
                            case 0:
                                this.draft.push(element)
                                break;
                            case 1:
                                this.normal.push(element)
                                break;
                            case 2:
                                this.recycle.push(element)
                        }
                    });
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}

</style>

