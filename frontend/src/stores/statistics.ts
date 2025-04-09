import { defineStore } from 'pinia';
import request from '../utils/request';

interface Statistics {
  supplierCount: number;
  purchaseOrderCount: number;
  salesOrderCount: number;
}

export const useStatisticsStore = defineStore('statistics', {
  state: (): Statistics => ({
    supplierCount: 0,
    purchaseOrderCount: 0,
    salesOrderCount: 0
  }),

  actions: {
    async loadStatistics() {
      try {
        // 获取供应商总数
        const supplierRes = await request.get("/api/suppliers", {
          params: {
            page: 1,
            pageSize: 1
          }
        });
        this.supplierCount = supplierRes.data.data.total;
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    },

    // 更新供应商数量
    updateSupplierCount(count: number) {
      this.supplierCount = count;
    }
  }
}); 