<template>
  <div class="supplier-list">
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="供应商名称">
          <el-input
            v-model="searchForm.supplier_name"
            placeholder="请输入供应商名称"
          />
        </el-form-item>
        <el-form-item label="产品类别">
          <el-input
            v-model="searchForm.product_category"
            placeholder="请输入产品类别"
          />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input
            v-model="searchForm.contact_person"
            placeholder="请输入联系人"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增供应商</el-button>
    </div>

    <el-table :data="supplierList" border style="width: 100%">
      <el-table-column prop="supplier_name" label="供应商名称" />
      <el-table-column prop="contact_person" label="联系人" />
      <el-table-column prop="contact_phone" label="联系电话" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="product_category" label="产品类别" />
      <el-table-column prop="credit_rating" label="信用评级" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../../utils/request";

const router = useRouter();
const supplierList = ref([]);

const searchForm = reactive({
  supplier_name: "",
  product_category: "",
  contact_person: "",
});

const handleSearch = async () => {
  try {
    const response = await request.get("/api/suppliers", { params: searchForm });
    supplierList.value = response.data.data.items;
  } catch (error: any) {
    console.error('获取供应商列表失败:', error);
    ElMessage.error(error.response?.data?.message || "获取供应商列表失败");
  }
};

const resetSearch = () => {
  searchForm.supplier_name = "";
  searchForm.product_category = "";
  searchForm.contact_person = "";
  handleSearch();
};

const handleAdd = () => {
  router.push("/suppliers/create");
};

const handleEdit = (row: any) => {
  router.push(`/suppliers/${row.id}`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm("确认删除该供应商吗？", "提示", {
      type: "warning",
    });
    await request.delete(`/api/suppliers/${row.id}`);
    ElMessage.success("删除成功");
    handleSearch();
  } catch (error: any) {
    if (error !== "cancel") {
      console.error('删除失败:', error);
      ElMessage.error(error.response?.data?.message || "删除失败");
    }
  }
};

// 初始化加载数据
handleSearch();
</script>

<style scoped>
.supplier-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}
</style>
