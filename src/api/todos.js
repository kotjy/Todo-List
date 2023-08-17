import axios from 'axios'

const baseUrl = 'https://todo-list.alphacamp.io/'; 

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error(error);
  },
);

export const getTodos = async () => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    return res.data.data;
  } catch (error) {
    console.error('[Get Todos failed]: ', error);
  }
};

export const createTodo = async (payloud) => {
  const { title, isDone } = payloud; //payload代表打包後的資訊，這裡代表想要新增的todo內容
   try{
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      //接收到資料庫回應後才能繼續進行的動作需要放在await關鍵字後
      title,
      isDone,
    });
    return res.data;
   }catch(error) {
    console.error('[Create Todo failed]:', error)
   }
};

export const patchTodo = async (payload) =>{
  const {id, title, isDone} = payload;

  try{
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    }); ;
    return res.data
  }catch(error){
    console.error('[Patch Todo failed]:', error);
  }
};

export const deleteTodo = async(id) =>{
  try{
    const res = await axiosInstance.delete(`${baseUrl}/todos)${id}`);
    return res.data;
  } catch (error){
    console.error(`[Delete Todo failed]:` ,error)
  }
};