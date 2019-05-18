<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 分组管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" class="handle-del mr10" @click="handleAdd">添加分组</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="id" width="70" sortable></el-table-column>
                <el-table-column prop="name" label="分组名" width="120">
                </el-table-column>
                <el-table-column prop="pid" label="pid" width="70" sortable></el-table-column>
                <el-table-column prop="p_name" label="上级分组名" ></el-table-column>
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
                <el-form-item label="分组名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="上级组名">
                    <el-cascader :options="options" expand-trigger="hover" v-model="form.selectedOptions" change-on-select
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="菜单权限">
                    <el-tree :data="menus" :props="defaultProps" 
                    node-key="id" :default-checked-keys="form.menus"
                    ref="tree" show-checkbox ></el-tree>
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
import { getGroups, edit, add } from '@/api/group'
import { getMenus, getMenuIdsByGroupId } from '@/api/menu'
import { makeChildren, findParents, deepClone } from '@/utils'
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                select_word: '',
                editVisible: false,
                delVisible: false,
                form: {},
                idx: -1,
                options: [{
                    value: '0',
                    label: '根分组',
                }],
                menus: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
                
            }
        },
        mounted() {
        },
        created() {
            this.getData()
            this.resetForm()
            
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    if (d.name.indexOf(this.select_word) > -1 ) {
                        return d;
                    }
                })
            }
        },
        methods: {
            // 获取数据
            getData() {
                getGroups().then(response => {
                    this.tableData = response
                    //将所有的分组整理为按层级数据
                    const options = makeChildren(deepClone(response), 0, data => {
                        const newData = {
                            value: data.id,
                            label: data.name
                        }
                        if (data.children instanceof Array && data.children.length > 0) {
                            newData.children = data.children
                        }
                        return newData
                    })
                    this.options = this.options.concat(options)
                })
            },
            resetForm() {
                this.form = {
                    id: 0,
                    name: '',
                    pid: 0,
                    p_name: '',
                    selectedOptions: ['0'],
                    menus: []
                }
                if (this.menus.length > 0) {
                    this.setChecked()
                }
                this.idx = -1
            },
            handleAdd() {
                this.editVisible = true
                this.getMenus()
                this.resetForm()
            },
            handleEdit(index, row) {
                this.editVisible = true;
                this.getMenus()
                let ids = findParents(this.tableData, row.pid,)
                if (ids.length === 0) {
                    ids = ['0']
                }
                this.idx = index;
                this.form = {
                    id: row.id,
                    name: row.name,
                    pid: row.pid,
                    p_name: row.p_name,
                    selectedOptions: ids
                }
                this.getMenuIdsByGroupId(row.id)
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getGroupNameByGroupId(groupId) {
                for(const element of this.tableData) {
                    if (groupId == element.id) {
                        return element.name
                    }
                }
            },
            // 保存编辑
            saveEdit() {
                this.form.pid = this.form.selectedOptions[this.form.selectedOptions.length-1]
                this.form.menus = this.$refs.tree.getCheckedKeys()
                if (this.form.id > 0) {
                    //编辑
                    edit(this.form).then(response => {
                        this.form.p_name = this.getGroupNameByGroupId(this.form.pid)
                        this.$set(this.tableData, this.idx, this.form)
                        this.editVisible = false
                    })
                } else {
                    //添加
                    add(this.form).then(response => {
                        this.form.id = response
                        this.form.p_name = this.getGroupNameByGroupId(this.form.pid)
                        this.tableData.push(this.form)
                        this.editVisible = false
                    })
                }
            },
            // 确定删除
            deleteRow(){
                this.$message.error('暂不支持删除')
                this.delVisible = false
            },
            getMenus() {
                if (this.menus.length > 0) {
                    return;
                }
                //获取系统所有菜单列表
                getMenus().then(response => {
                    //将所有的菜单整理为按层级数据
                    this.menus = makeChildren(response, 0, data => {
                        const newData = {
                            id: data.id,
                            label: data.title
                        }
                        if (data.children instanceof Array && data.children.length > 0) {
                            newData.children = data.children
                        }
                        return newData
                    }, 'id', 'father_id')
                })
            },
            setChecked(arr=[]) {
                this.$refs.tree.setCheckedKeys(arr);
            },
            getMenuIdsByGroupId(group_id) {
                getMenuIdsByGroupId({group_id}).then(response => {
                    const ids = []
                    if (response instanceof Array) {
                        response.forEach(element => {
                            ids.push(element.menu_id)
                        });
                    }
                    this.setChecked(ids)
                })
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

    .el-cascader--small {
        width: 100% !important;
    }

    
    .checkbox {
        margin:5px 5px;
    }
    .menus-container {
        padding: 20px;
    }
    .main-menus,
    .all {
        overflow: auto;
    }
    .all {
        width: 130px;
    }
    .checkbox input {
         outline:none;
     }
    .checkbox label {
        display:inline-block;
        width:20px;
        height:20px;
        line-height:20px;
        text-align:center;
        border:2px solid #3b8be6;
        position:relative;
        border-radius:3px;
        font-family:"iconfont" !important;
        font-size:16px;
        font-style:normal;
        cursor: pointer;
        -webkit-font-smoothing:antialiased;
    }
    input {
        width:45px;
        height:45px;
    }
    input:checked+label {
        /*当复选框选的的时候改变边框色*/
        background:#3b8be6;
    }
    input+label .i {
        color:#fff;
    }
    input:checked+label .i {
        color:red;
    }
    input:checked+label {
        /*当复选框选的的时候改变边框色*/
        background:#3b8be6;
    }
    input+label:after {
        content:'√';
        color:#fff;
    }
    input:checked+label:after {
        content:'√';
        color:#fff;
    }
    .sub-menus {
        width: 150px;
        float: left;
        overflow: auto;
    }
</style>
