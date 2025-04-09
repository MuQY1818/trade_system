<template>
  <div class="product-list">
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品编码">
          <el-input v-model="searchForm.code" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">新增商品</el-button>
    </div>

    <el-table :data="productList" border style="width: 100%">
      <el-table-column prop="code" label="商品编码" width="120" />
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column prop="specification" label="规格型号" width="120" />
      <el-table-column prop="category" label="商品分类" width="120" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="price" label="标准价格" width="120">
        <template #default="scope">
          {{ scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="current_stock" label="当前库存" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
            {{ scope.row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.current_stock > 0"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../../utils/request";

const router = useRouter();
const productList = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

interface SearchForm {
  code: string;
  name: string;
  category: string;
  status: string;
}

const searchForm = reactive<SearchForm>({
  code: "",
  name: "",
  category: "",
  status: "",
});

// 加载商品分类
const loadCategories = async () => {
  try {
    const response = await request.get("/api/product-categories");
    categories.value = response.data.data;
  } catch (error: any) {
    console.error('获取商品分类失败:', error);
    ElMessage.error(error.response?.data?.message || "获取商品分类失败");
  }
};

const handleSearch = async () => {
  try {
    const response = await request.get("/api/products", {
      params: {
        ...searchForm,
        page: currentPage.value,
        pageSize: pageSize.value,
      },
    });
    productList.value = response.data.data.items;
    total.value = response.data.data.total;
  } catch (error: any) {
    console.error('获取商品列表失败:', error);
    ElMessage.error(error.response?.data?.message || "获取商品列表失败");
  }
};

const resetSearch = () => {
  (Object.keys(searchForm) as Array<keyof SearchForm>).forEach(key => {
    searchForm[key] = "";
  });
  currentPage.value = 1;
  handleSearch();
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  handleSearch();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  handleSearch();
};

const handleAdd = () => {
  router.push("/products/create");
};

const handleEdit = (row: any) => {
  router.push(`/products/${row.id}`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm("确认删除该商品吗？", "提示", {
      type: "warning",
    });
    await request.delete(`/api/products/${row.id}`);
    ElMessage.success("删除成功");
    handleSearch();
  } catch (error: any) {
    if (error !== "cancel") {
      console.error('删除失败:', error);
      ElMessage.error(error.response?.data?.message || "删除失败");
    }
  }
};

onMounted(() => {
  loadCategories();
  handleSearch();
});
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.operation-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 