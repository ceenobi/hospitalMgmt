import axiosInstance from "@/shared/utils/axiosInstance";

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/api/v1/user/create", userData);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const getAllUsers = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const sort = searchParams.get("sort") || "";
  const response = await axiosInstance.get(
    `/api/v1/user/all?page=${page}&limit=${limit}&query=${query}&role=${role}&sort=${sort}`
  );
  return response.data;
};

export const updateUserRole = async (userId, userData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/user/${userId}/update`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/user/${userId}/delete`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
};
