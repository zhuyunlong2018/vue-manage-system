
import { getMenus, add, edit } from '@/api/menu'
export default {
    name: 'Menus',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            loading: false,
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
            this.loading = true
            getMenus().then(response => {
                this.tableData = response
                this.loading = false
            })
            .catch(error => {
                console.log(error)
                this.loading = false
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
            this.loading = true
            if (this.form.id > 0) {
                //编辑
                edit(this.form).then(response => {
                    this.editVisible = false;
                    this.$set(this.tableData, this.idx, this.form);
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
            } else {
                //添加
                add(this.form).then(response => {
                    this.form.id = response
                    this.editVisible = false;
                    this.tableData.push(this.form)
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
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