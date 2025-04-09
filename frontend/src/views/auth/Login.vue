<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="login-form"
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
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">
            登录
          </el-button>
          <el-button @click="$router.push('/register')">注册账号</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus';
import type { AxiosResponse } from 'axios';
import request from "../../utils/request";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface ApiResponse {
  code: number;
  data: LoginResponse;
  message: string;
}

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  username: "",
  password: "",
});

const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const handleLogin = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true;
        console.log('开始登录请求:', form);
        const response: AxiosResponse<ApiResponse> = await request.post("/api/auth/login", form);
        
        if (!response.data || response.data.code !== 200) {
          throw new Error(response.data?.message || '登录失败');
        }

        const { token, user } = response.data.data;
        if (!token || !user) {
          throw new Error('登录响应数据不完整');
        }

        // 保存token和用户信息
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        ElMessage.success("登录成功");
        
        // 确保路由跳转前token已经保存
        await router.push("/");
      } catch (error: any) {
        console.error('登录错误:', error);
        ElMessage.error(error.response?.data?.message || error.message || "登录失败");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
}

.login-form {
  padding: 20px 0;
}
</style>
