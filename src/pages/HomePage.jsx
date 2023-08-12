import { useAuth } from "contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const HomePage = () => {
  const {isAuththenticated} = useAuth();
  const navigate = useNavigate();

  useEffect( () => {
    if(isAuththenticated){
      navigate('/todos');
    }else {
      navigate('/login')
    }
  }, [navigate, isAuththenticated])
}

export default HomePage;
