<template>
  <div class="supplier-form">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="form-container"
    >
      <el-form-item label="供应商名称" prop="supplier_name">
        <el-input v-model="form.supplier_name" placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="联系人" prop="contact_person">
        <el-input v-model="form.contact_person" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contact_phone">
        <el-input v-model="form.contact_phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="产品类别" prop="product_category">
        <el-input
          v-model="form.product_category"
          placeholder="请输入产品类别"
        />
      </el-form-item>
      <el-form-item label="信用评级" prop="credit_rating">
        <el-select v-model="form.credit_rating" placeholder="请选择信用评级">
          <el-option label="A" value="A" />
          <el-option label="B" value="B" />
          <el-option label="C" value="C" />
          <el-option label="D" value="D" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          type="textarea"
          placeholder="请输入备注"
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
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import request from "../../utils/request";
import { useStatisticsStore } from "../../stores/statistics";

const router = useRouter();
const route = useRoute();
const statisticsStore = useStatisticsStore();
const formRef = ref();

const form = reactive({
  supplier_name: "",
  contact_person: "",
  contact_phone: "",
  email: "",
  address: "",
  product_category: "",
  credit_rating: "",
  remarks: "",
});

const rules = {
  supplier_name: [
    { required: true, message: "请输入供应商名称", trigger: "blur" },
  ],
  contact_person: [
    { required: true, message: "请输入联系人", trigger: "blur" },
  ],
  contact_phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  address: [{ required: true, message: "请输入地址", trigger: "blur" }],
  product_category: [
    { required: true, message: "请输入产品类别", trigger: "blur" },
  ],
  credit_rating: [
    { required: true, message: "请选择信用评级", trigger: "change" },
  ],
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (route.params.id) {
          await request.put(`/api/suppliers/${route.params.id}`, form);
          ElMessage.success("更新成功");
        } else {
          await request.post("/api/suppliers", form);
          ElMessage.success("创建成功");
        }
        await statisticsStore.loadStatistics();
        router.push("/suppliers");
      } catch (error: any) {
        console.error('操作失败:', error);
        ElMessage.error(error.response?.data?.message || (route.params.id ? "更新失败" : "创建失败"));
      }
    }
  });
};

const handleCancel = () => {
  router.push("/suppliers");
};

const loadSupplier = async (id: string) => {
  try {
    const response = await request.get(`/api/suppliers/${id}`);
    Object.assign(form, response.data.data);
  } catch (error: any) {
    console.error('获取供应商信息失败:', error);
    ElMessage.error(error.response?.data?.message || "获取供应商信息失败");
    router.push("/suppliers");
  }
};

onMounted(() => {
  if (route.params.id) {
    loadSupplier(route.params.id as string);
  }
});
</script>

<style scoped>
.supplier-form {
  padding: 20px;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
