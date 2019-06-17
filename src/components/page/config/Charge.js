/**
 * 推广--推广配置
 */
import { getCharges, editCharge, addCharge, delCharge } from '@/api/config'

export default {
    name: 'ChargeConfig',
    data() {
        return {
            tableData: [],
            loading: false,
            editVisible: false,
            delVisible: false,
            form: {},
            idx: -1,
        }
    },
    created() {
        this.getData()
        this.resetForm()
    },
    computed: {
    },
    methods: {
        // 获取数据
        getData() {
            this.loading = true;
            getCharges().then(response => {
                this.tableData = response
                this.loading = false
            })
            .catch(error => {
                this.loading = false
            })
        },
        resetForm() {
            this.form = {
                id: 0,
                charge_money: '0',
                number: '0'
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
                charge_money: row.charge_money,
                number: row.number
            }
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true
        },
        // 保存编辑
        saveEdit() {
            this.loading = true
            if (this.form.id > 0) {
                //编辑
                editCharge(this.form).then(response => {
                    this.$set(this.tableData, this.idx, this.form)
                    this.editVisible = false
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
            } else {
                //添加
                addCharge(this.form).then(response => {
                    this.form.id = response
                    this.tableData.push(this.form)
                    this.editVisible = false
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
            this.loading = true
            delCharge({ id: this.tableData[this.idx].id }).then(response => {
                this.tableData.splice(this.idx, 1)
                this.delVisible = false
                this.loading = false
            })
            .catch(error => {
                this.loading = false
            })
        
        }
    }
}