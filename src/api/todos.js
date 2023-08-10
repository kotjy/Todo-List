import axios from 'axios'

const baseUrl = 'http://localhost:3001'; 

export const getTodos = async () => {
  try {
    const res = await axios.get(`${baseUrl}/todos`);
    return res.data;
  } catch (error) {
    console.error('[Get Todos failed]: ', error);
  }
};

export const createTodo = async (payloud) => {
  const { title, isDone } = payloud; //payload代表打包後的資訊，這裡代表想要新增的todo內容
   try{
    const res = await axios.post(`${baseUrl}/todos`, { //接收到資料庫回應後才能繼續進行的動作需要放在await關鍵字後
      title,
      isDone,
    });
    return res.data;
   }catch(error) {
    console.log('[Create Todo failed]:', error)
   }
};

export const patchTodo =() =>{};

export const deleteTodo =() =>{};