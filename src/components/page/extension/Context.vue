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
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="handleEdit(scope.row)">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
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
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="handleEdit(scope.row)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
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
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="handleEdit(scope.row)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
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
                <el-form-item label="分组名">
                    <el-input v-model="form.group_name"></el-input>
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
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                editVisible: false,
                form: {},
                normal: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护【系统通知】该系统将于今晚凌晨2点到5点进行升级维护【系统通知】该系统将于今晚凌晨2点到5点进行升级维护【系统通知】该系统将于今晚凌晨2点到5点进行升级维护【系统通知】该系统将于今晚凌晨2点到5点进行升级维护【系统通知】该系统将于今晚凌晨2点到5点进行升级维护【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
                },{
                    date: '2018-04-19 21:00:00',
                    title: '今晚12点整发大红包，先到先得',
                }],
                draft: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }],
                recycle: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }]
            }
        },
        created() {
            this.resetForm()
        },
        methods: {
            resetForm() {
                this.form = {
                    id: 0,
                    content: '',
                    group_id: 0,
                    group_name: ''
                }
                this.idx = -1
            },
            handleNormal(index) {
                const item = this.draft.splice(index, 1)
                this.normal = item.concat(this.normal)
            },
            handleDel(index) {
                const item = this.normal.splice(index, 1)
                this.recycle = item.concat(this.recycle)
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1)
                this.normal = item.concat(this.normal)
            },
            handleDraft(index) {
                const item = this.normal.splice(index, 1)
                this.draft = item.concat(this.draft)
            },
            handleAdd() {
                this.resetForm()
                this.editVisible = true
            },
            handleEdit(row) {
                this.editVisible = true
            },
            // 保存编辑
            saveEdit() {
                if (this.form.id > 0) {
                    //编辑
                    edit(this.form).then(response => {
                        this.$set(this.tableData, this.idx, this.form)
                        this.editVisible = false
                    })
                } else {
                    //添加
                    add(this.form).then(response => {
                        this.tableData.push(this.form)
                        this.editVisible = false
                    })
                }
            },
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

