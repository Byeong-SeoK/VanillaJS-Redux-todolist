import { legacy_createStore as createStore } from "redux";

const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

const addToDo = (text) => {
  return {
    type: ADD_TODO,
    text,
  };
};

const deleteToDo = (id) => {
  return {
    type: DELETE_TODO,
    id,
  };
};

const reducer = (state = [], action) => {
  //console.log(action);

  switch (action.type) {
    case ADD_TODO:
      const newToDoObj = { text: action.text, id: Date.now() };
      return [newToDoObj, ...state];
    //redux에 들어간 data는 read-only이다.
    //그래서 [].push와 같은 mutate를 할 수 가 없고
    //또 직접적으로 data의 값을 바꿀 수 없다.
    //그러므로 현재의 값을 구조분해할당하고 새로운 값과
    //새로운 배열 안에 묶어서 그 배열을 return하는 형태로 data를 바꿔야 한다.

    case DELETE_TODO:
      const cleaned = state.filter((toDo) => toDo.id !== action.id);
      return cleaned;
    default:
      return state;
  }
};

const store = createStore(reducer);

//store.subscribe(() => console.log(store.getState()));

const dispatchAddToDo = (text) => {
  //store.dispatch({ type: ADD_TODO, text: text });
  //action에 key로 type과 text가 존재하는 객체를 넘겨준다.
  //이때 type은 상황을 의미하고 text는 어떤 data인지를 의미한다.
  store.dispatch(addToDo(text));
};

const dispatchDeleteToDo = (e) => {
  //console.log(e.target.parentNode.id);

  const id = parseInt(e.target.parentNode.id);
  store.dispatch(deleteToDo(id));
};

const paintToDos = () => {
  const toDos = store.getState();
  ul.innerHTML = "";

  toDos.forEach((toDo) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "DEL";
    btn.addEventListener("click", dispatchDeleteToDo);
    li.id = toDo.id;
    li.innerText = toDo.text;
    li.appendChild(btn);
    ul.appendChild(li);
  });
};

store.subscribe(paintToDos);

const onSubmit = (e) => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  dispatchAddToDo(toDo);
};

form.addEventListener("submit", onSubmit);
