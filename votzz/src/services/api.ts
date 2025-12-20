import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajuste para sua URL de backend
});

// Interceptor para adicionar o Tenant ID se necessário
api.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('vtz_tenant_id');
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});