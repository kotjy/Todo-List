import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useState } from 'react';
import { useEffect } from 'react';
import { getTodos, createTodo } from '../api/todos.js';


const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);

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

  const handleToggleDone = (id) => {
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
  };

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

  
  const handleSave = ({ id, title }) => {
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
  };

  const handleDelete = (id) =>{
    setTodos((prevTodos) => {
      return prevTodos.filter(todo =>
      todo.id !== id
      )
    })
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
