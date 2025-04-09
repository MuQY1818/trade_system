<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>注册</h2>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading">
            注册
          </el-button>
          <el-button @click="$router.push('/login')">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormRules } from "element-plus";
import type { AxiosResponse } from "axios";
import request from "../../utils/request";

interface ApiResponse {
  code: number;
  message?: string;
  data?: any;
}

const router = useRouter();
const formRef = ref();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
});

const handleRegister = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true;
        const response: AxiosResponse<ApiResponse> = await request.post("/api/auth/register", {
          username: form.username,
          password: form.password,
          email: form.email
        });
        
        ElMessage.success("注册成功");
        router.push("/login");
      } catch (error: any) {
        // 错误已经被拦截器处理，这里不需要重复显示
        console.error("注册错误:", error);
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.register-card {
  width: 400px;
}

.register-form {
  padding: 20px 0;
}
</style>
