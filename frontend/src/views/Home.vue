<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>系统概览</span>
            </div>
          </template>
          <div class="card-content">
            <h3>欢迎使用贸易管理系统</h3>
            <p>本系统提供以下功能：</p>
            <ul>
              <li>供应商管理</li>
              <li>采购订单管理</li>
              <li>销售订单管理</li>
              <li>库存管理</li>
              <li>财务管理</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>供应商统计</span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic title="供应商总数" :value="0">
              <template #suffix>
                <span>家</span>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>采购订单统计</span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic title="本月采购订单" :value="0">
              <template #suffix>
                <span>笔</span>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>销售订单统计</span>
            </div>
          </template>
          <div class="card-content">
            <el-statistic title="本月销售订单" :value="0">
              <template #suffix>
                <span>笔</span>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const supplierCount = ref(0);
const purchaseOrderCount = ref(0);
</script>

<style scoped>
.home {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 20px 0;
}

ul {
  list-style-position: inside;
  margin-top: 10px;
}

li {
  line-height: 2;
}
</style>
