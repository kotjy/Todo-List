import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { register, checkPermission } from '../api/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] =useState('')
  const navigate = useNavigate();

  const handleClick = async() =>{
    if(username.length === 0){
      return;
    }
    if(email.length === 0){
      return;
    }
    if(password.length === 0){
      return;
    }
    const {success, authToken} = await register({username, email, password})
    if(success){ //利用success屬性來確認是否成功
    localStorage.setItem('authToken', authToken);

 // 登入成功訊息
    Swal.fire({
        position: 'top', //出現位子
        title: '註冊成功！',
        timer: 1000, 
        icon: 'success', //出現多久消失
        showConfirmButton: false,
      });
      return;
    }
    // 登入失敗訊息
    Swal.fire({
      position: 'top',
      title: '註冊失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  }

  useEffect( () =>{
   const checkTokenIsValid = async () =>{
    const authToken = localStorage.getItem('authToken'); //取出token
    if(!authToken){ //如果不存在就停留在頁面
      return;
    }
    const result = await checkPermission(authToken) //用checkPermission查看token是否有效
    if(result) {
      navigate('/todos') 
    }
   };
   checkTokenIsValid();
  }, [navigate])



  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

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
          label="Email"
          placeholder="請輸入email"
          value={email}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <Link to="/login">
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
