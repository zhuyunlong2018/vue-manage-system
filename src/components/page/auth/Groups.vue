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
            <el-table :data="data" border class="table" v-loading="loading" ref="multipleTable" @selection-change="handleSelectionChange">
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
import '@/components/page/BaseTable.css'
import './Groups.css'
import Groups from './Groups'
export default Groups
</script>

