// const API_BASE_URL = 'http://47.93.247.236:3000';//3000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';//12138
const API_TEST_SQL = import.meta.env.VITE_API_TEST_URL || '';// 测试接口

export default {
  API_BASE_URL,
  API_TEST_SQL
};
