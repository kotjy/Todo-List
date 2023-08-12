import axios from 'axios'
//使用同一個api的func.盡量都放在一起 
const authURL = 'https://todo-list.alphacamp.io/api/auth';

//登入方法
export const login = async ({username, password}) =>{
  try{
    const {data} = await axios.post(`${authURL}/login`, {
      username,
      password,
    })
   
   //若後端認證成功會回傳authToken和使用者資料
    const {authToken} = data;

    if (authToken){ //這裡代表若authToken存在代表登入成功，就會回傳資料
      return {success: true, ...data};
    }
    return data;
  }catch(error) {
    console.error('[Login Failed]:', error)
    return{ success: false};
  }
}

export const register = async ({username, email, password}) =>{
  try{
    const {data} =await axios.post(`${authURL}/register`, {
      username,
      email,
      password,
    })

    const {authToken} = data;
    if(authToken) {
      return {success:true, ...data};
    }
    return data;
  }catch(error){
    console.error('[Register Failed]:', error)
     return { success: false };
  }
}

//每次切換頁面時重新向後端提交身份憑證，確認authToken仍然有效，才繼續動作
export const checkPermission = async (authToken) => {
  try {
    const response = await axios.get(`${authURL}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return response.data.success;
  } catch (error) {
    console.error('[Check Permission Failed]:', error);
  }
}; 