import { register, login, checkPermission} from "api/auth";
import { createContext } from "react";
import { useState, useEffect } from "react";

import * as jwt from 'jsonwebtoken'
import { useLocation } from "react-router-dom";
import { useContext } from "react";

//定義想共享的狀態和方法
const defaultAuthContext ={
  isAuthenticated:false,//使用者是否登入的判斷依據
  currentMember:null, //當前使用者的資料
  register:null,
  login:null,
  logout:null,
}

const AuthContext = createContext(defaultAuthContext); //完成context的建立
export const useAuth = () => useContext(AuthContext);
//管理狀態，封裝會影響到身份的功能
export const AuthProvider = ({ children }) =>{
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [payload, setPayload] =useState(null)
  const { pathname } = useLocation();

  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
  <AuthContext.Provider 
  value={{ 
    isAuthenticated , 
    currentMember:payload &&{
      id:payload.sub,
      name:payload.name
    },

    register : async (data)=>{
      const {success, authToken} = await register({
        username:data.username,
        email:data.email,
        password:data.password,
      });
      const tempPayload = jwt.decode(authToken);
      if(tempPayload){
        setPayload(tempPayload);
        setIsAuthenticated(true);
        localStorage.setItem('authToken', authToken);
      }else{
        setPayload(null);
        setIsAuthenticated(false);
      }
      return success;
    },
    login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },

   }}>
   {children}
   </AuthContext.Provider>
  )
}

