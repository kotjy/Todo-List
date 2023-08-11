import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState } from 'react';
import { useEffect } from 'react';
import { getTodos, createTodo, patchTodo, deleteTodo } from '../api/todos.js';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../api/auth.js';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = async() => {
    if (inputValue.length === 0) {
      return;
    }
    try{
      const data = await createTodo({
      title:inputValue,
      isDone:false,
    });

    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: data.id,
          title: data.title,
          isDone: data.isDone,
          isEdit:false,
        },
      ];
    });
    setInputValue('');
    }catch (error) {
      console.error(error)
    }
  };

  //捕捉使用者的 enter/esc 按鍵事件
  const handleKeyDown = async() => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };


  const handleToggleDone =async (id) => {
    const currentTodo = todos.find((todo) => todo.id ===id)
   //用id查找當下要toggle的項目並存在currentTodo中
    try{
      await patchTodo({
        id,
        isDone:!currentTodo.isDone,
      })
      setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            //檢查這筆todo有沒有跟傳進來的id一樣
            ...todo,
            isDone: !todo.isDone, //有的話改變當前的樣式（！代表相反）
          };
        }
        return todo; //return其他todo
      });
    });
  }catch(error){
    console.error(error);
  }
    }
    

  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        return { ...todo, isEdit: false };
      });
    });
  };

  
  const handleSave = async({ id, title }) => {
    try{
      await patchTodo({
        id,
        title,
      })
setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
            isEdit: false,
          };
        }
        return todo;
      });
    });
    } catch (error){
      console.error(error);
    }
  };

  const handleDelete = async(id) =>{
    try{
     await deleteTodo(id) //用id選出要刪除的項目
    setTodos((prevTodos) => {
      return prevTodos.filter(todo =>
      todo.id !== id
      )
    })
    }catch(error){
      console.error(error);
    }
   
  }

 useEffect(() => {
   const getTodosAsync = async () => {
     try {
       const todos = await getTodos();

       setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
     } catch (error) {
       console.error(error);
     }
   };
   getTodosAsync();
 }, []); //第二個參數是用來設定dependency，這裡留空


 useEffect(() => {
   const checkTokenIsValid = async () => {
     const authToken = localStorage.getItem('authToken'); //取出token
     if (!authToken) {
       navigate('/login')
     }
     const result = await checkPermission(authToken); //用checkPermission查看token是否有效，這個函式會新增一個布林值，確認為true才允許導向/todos 
     if (!result) {
       navigate('/login');
     }
   };
   checkTokenIsValid();
 }, [navigate]); 




  return (
    <div>
      TodoPage
      <Header />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer numberOfTodos ={todos.length} />
    </div>
  );
};

export default TodoPage;
