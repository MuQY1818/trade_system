<template>
  <div class="product-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="form"
    >
      <el-form-item label="商品编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入商品编码" />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="formData.specification" placeholder="请输入规格型号" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formData.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择分类" clearable>
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标准价格" prop="price">
        <el-input-number
          v-model="formData.price"
          :precision="2"
          :step="0.1"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="成本价格" prop="cost">
        <el-input-number
          v-model="formData.cost"
          :precision="2"
          :step="0.1"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="最小库存" prop="min_stock">
        <el-input-number
          v-model="formData.min_stock"
          :min="0"
          :precision="0"
        />
      </el-form-item>
      <el-form-item label="最大库存" prop="max_stock">
        <el-input-number
          v-model="formData.max_stock"
          :min="0"
          :precision="0"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="active">启用</el-radio>
          <el-radio label="inactive">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          rows="4"
          placeholder="请输入商品描述"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import request from "../../utils/request";

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const categories = ref([]);

const formData = reactive({
  code: "",
  name: "",
  specification: "",
  unit: "",
  category: "",
  price: 0,
  cost: 0,
  min_stock: 0,
  max_stock: 9999,
  status: "active",
  description: "",
});

const rules = {
  code: [{ required: true, message: "请输入商品编码", trigger: "blur" }],
  name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
  category: [{ required: true, message: "请选择商品分类", trigger: "change" }],
  price: [{ required: true, message: "请输入标准价格", trigger: "blur" }],
  cost: [{ required: true, message: "请输入成本价格", trigger: "blur" }],
};

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

// 加载商品详情
const loadProduct = async (id: string) => {
  try {
    const response = await request.get(`/api/products/${id}`);
    Object.assign(formData, response.data.data);
  } catch (error: any) {
    console.error('获取商品详情失败:', error);
    ElMessage.error(error.response?.data?.message || "获取商品详情失败");
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const id = route.params.id;
        if (id) {
          await request.put(`/api/products/${id}`, formData);
          ElMessage.success("更新成功");
        } else {
          await request.post("/api/products", formData);
          ElMessage.success("创建成功");
        }
        router.push("/products");
      } catch (error: any) {
        console.error('保存失败:', error);
        ElMessage.error(error.response?.data?.message || "保存失败");
      }
    }
  });
};

const handleCancel = () => {
  router.push("/products");
};

onMounted(() => {
  loadCategories();
  const id = route.params.id;
  if (id) {
    loadProduct(id as string);
  }
});
</script>

<style scoped>
.product-form {
  padding: 20px;
}

.form {
  max-width: 800px;
  margin: 0 auto;
}
</style> 