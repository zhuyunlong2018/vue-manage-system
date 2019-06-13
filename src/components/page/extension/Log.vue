<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 推广数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
            </div>
            <el-table :data="data" border class="table" ref="multipleTable"
            v-loading.fullscreen="loading" 
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, 0.3)">
                <el-table-column prop="id" label="流水id" sortable width="100">
                </el-table-column>
                <el-table-column prop="uid" label="推广员id" sortable width="100">
                </el-table-column>
                <el-table-column prop="name" label="推广员名称" width="120">
                </el-table-column>
                <el-table-column prop="create_time" label="推广时间">
                </el-table-column>
                <el-table-column prop="nickname" label="被推广人昵称">
                </el-table-column>
                <el-table-column prop="send_num" label="发送成功数量">
                </el-table-column>
                <el-table-column prop="error_num" label="发送失败数量">
                </el-table-column>
                <el-table-column prop="total_num" label="好友总数">
                </el-table-column>
                <!-- <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="queryParameters.limit" :total="totalCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="日期">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
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
import Log from './Log'
export default Log
</script>
