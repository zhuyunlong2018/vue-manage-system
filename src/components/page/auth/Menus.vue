<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" @click="handleAdd">添加菜单</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="id" width="70" sortable>
                </el-table-column>
                <el-table-column prop="father_id" width="70" label="上级id" sortable ></el-table-column>
                <el-table-column prop="title" label="标题" width="120">
                </el-table-column>
                <el-table-column prop="path" label="地址" ></el-table-column>
                <el-table-column prop="component" label="绑定前端组件" ></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="菜单标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.path"></el-input>
                </el-form-item>
                <el-form-item label="绑定组件">
                    <el-input v-model="form.component"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上级菜单id">
                    <el-input v-model="form.father_id"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getMenus, add, edit } from '@/api/menu'
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                editVisible: false,
                delVisible: false,
                form: {},
                idx: -1
            }
        },
        created() {
            this.getData();
            this.resetForm()
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let filterPath = false;
                    if (d.path) {
                        filterPath = d.path.indexOf(this.select_word) > -1 
                    }
                    if (d.title.indexOf(this.select_word) > -1 || filterPath ) {
                        return d;
                    }
                })
            }
        },
        methods: {
            // 获取数据
            getData() {
                getMenus().then(response => {
                    this.tableData = response
                })
            },
            resetForm() {
                this.form = {
                    id: 0,
                    title: '',
                    father_id: 0,
                    path: '',
                    component: '',
                    icon: 'el-icon-lx-cascades',
                    sort: 0,
                    status: 1
                }
                this.idx = -1
            },
            handleAdd() {
                this.resetForm();
                this.editVisible = true;
            },
            handleEdit(index, row) {
                this.idx = index;
                this.form = {
                    id: row.id,
                    title: row.title,
                    father_id: row.father_id,
                    path: row.path,
                    component: row.component,
                    icon: row.icon,
                    sort: row.sort,
                    status: row.status
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveEdit() {
                console.log(this.idx)
                if (this.form.id > 0) {
                    //编辑
                    edit(this.form).then(response => {
                        this.editVisible = false;
                        this.$set(this.tableData, this.idx, this.form);
                    })
                } else {
                    //添加
                    add(this.form).then(response => {
                        this.editVisible = false;
                        this.tableData.push(this.form)
                    })
                }
            
            },
            // 确定删除
            deleteRow(){
                this.$message.error('暂不支持删除');
                this.delVisible = false;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
