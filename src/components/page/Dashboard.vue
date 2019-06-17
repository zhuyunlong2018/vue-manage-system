<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <div class="user-info">
            <img src="../../assets/img/img.jpg" class="user-avator" alt>
            <div class="user-info-cont">
              <p>
                用户名：
                <span class="user-info-name">{{userInfo.name}}</span>
              </p>
              <p>分组名：{{userInfo.groupName}}</p>
              <!-- <QrCode content ='https://www.baidu.com' /> -->
            </div>
          </div>
          <span>积分</span>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
          <el-form ref="form" :model="chargeForm" label-width="80px">
            <el-form-item label="选择器">
              <el-select v-model="chargeForm.id" placeholder="请选择">
                <el-option
                  key="0"
                  label="请选择"
                  value="0"
                ></el-option>
                <el-option
                  v-for="charge in chargeList"
                  :key="charge.id"
                  label="步步高"
                  :value="charge.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 首页
 */
import { mapGetters } from "vuex";
import { getCharges } from "@/api/config";
import QrCode from "@/components/common/QrCode";

export default {
  name: "dashboard",
  components: {
    QrCode
  },
  data() {
    return {
      chargeList: [],
      chargeForm: {
        id: '0'
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    getCharges() {
      getCharges()
        .then(response => {
          this.chargeList = response;
        })
        .catch(error => {});
    }
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont .user-info-name {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
