import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const loginUser = (email) => axios.post(`${API_URL}/users/login`, { email });
export const registerUser = (userData) => axios.post(`${API_URL}/users`, userData);
export const getUsers = () => axios.get(`${API_URL}/users`);
export const createGroup = (groupData) => axios.post(`${API_URL}/groups`, groupData);
export const getGroups = (userId) => axios.get(`${API_URL}/groups${userId ? `?userId=${userId}` : ''}`);
export const getGroup = (groupId) => axios.get(`${API_URL}/groups/${groupId}`);
export const addExpense = (expenseData) => axios.post(`${API_URL}/expenses`, expenseData);
export const getGroupExpenses = (groupId) => axios.get(`${API_URL}/expenses/group/${groupId}`);
export const getGroupBalance = (groupId) => axios.get(`${API_URL}/expenses/group/${groupId}/balance`);
export const settleDebt = (settleData) => axios.post(`${API_URL}/expenses/settle`, settleData);
