import { useState, useEffect } from 'react';
import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useAuth } from 'contexts/AuthContext';

const LoginPage = () => {
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const navigate = useNavigate();

const { login, isAuththenticated } = useAuth();

const handleClick = async() =>{
  if(username.length === 0){
    return ;
  }
  if (password.length === 0) {
    return;
  }
  //觸發登入可以拿到success 
  const success = await login({
    username, password
  })
  if(success){

 // 登入成功訊息
    Swal.fire({
        position: 'top', //出現位子
        title: '登入成功！',
        timer: 1000, 
        icon: 'success', //出現多久消失
        showConfirmButton: false,
      });
      return;
    }
    // 登入失敗訊息
    Swal.fire({
      position: 'top',
      title: '登入失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  }


useEffect(() => {
  if (isAuththenticated){
    navigate('/todos')
  }
  },[navigate, isAuththenticated])


  return ( 
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼" 
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
