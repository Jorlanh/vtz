import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Injeta o Tenant ID do condomínio em cada requisição
api.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('vtz_tenant_id');
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});

// Adicione interceptor para erros (opcional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized, ex: redirect to login
    }
    return Promise.reject(error);
  }
);