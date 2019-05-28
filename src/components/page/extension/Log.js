import { getLogs } from '@/api/extensionLog'
export default {
    name: 'extensionLog',
    data() {
        return {
            url: './vuetable.json',
            queryParameters: {
                page: 1,
                limit: 10
            },
            loading: false,
            tableData: [],
            totalCount: 0,
            select_word: '',
            is_search: false,
            editVisible: false,
            delVisible: false,
            form: {
                name: '',
                date: '',
                address: ''
            },
            idx: -1
        }
    },
    created() {
        this.getData();
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                if (d.name.indexOf(this.select_word) > -1) {
                    return d;
                }
            })
        }
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.queryParameters.page = val;
            this.getData();
        },
        getData() {
            this.loading = true
            getLogs(this.queryParameters).then(response => {
                if (response.count > 0) {
                    this.tableData = response.data
                    this.totalCount = response.count
                }
                this.loading = false
            })
            .catch(error => {
                this.loading = false
            })
        },
        search() {
            this.is_search = true;
        },
        handleEdit(index, row) {
            this.idx = index;
            const item = this.tableData[index];
            this.form = {
                name: item.name,
                date: item.date,
                address: item.address
            }
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.$set(this.tableData, this.idx, this.form);
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx+1} 行成功`);
        },
        // 确定删除
        deleteRow(){
            this.tableData.splice(this.idx, 1);
            this.$message.success('删除成功');
            this.delVisible = false;
        }
    }
}