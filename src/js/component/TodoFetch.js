//Realizamos las importaciones necesarias.
import React from "react";
import { useState, useEffect } from "react";
//Definimos nuestro componente.
const TodoFetch = () => {
    //Definimos nuestros estados e inicializamos los hooks(valor inicial de las variables).
    const [todos, setTodos] = useState([]); //Lo inicializamos como un array vacío(representa la lista de tareas).
    const [inputValue, setInputValue] = useState(""); //Lo inicializamos como un string vacío(representa el campo de texto).
    //Añadimos el hook "useEffect()" que contiene dos parámetros("getTodos()" y "[]").
    useEffect(() => {
        getTodos(); //En este caso el hook ejecutará la función "getTodos()"(Solicita al servidor la lista de tareas de Elroro23).
    }, []); //El array de dependencias vacío hace que "getTodos()" se ejecute solo cuando "useEffect" se monte(una vez).
    //Guardamos la URL de nuestro TODO`S LIST en una variable(por comodidad).
    const urlTodos = "https://playground.4geeks.com/todo/"

    function getTodos() { //Función para obtener la lista de tareas del servidor.
        fetch(urlTodos + "users/Elroro23", { //El "fetch()" hace la solicitud al servidor(aquí se coloca la url).
            method: "GET", //Con el método "GET" solicitamos información de nuestro usuario(lista de tareas).
        })
            //.then() recibe una respuesta del servidor.
            .then(response => {
                if (!response.ok) { //Verificamos el status del objeto response, si NO es "ok" añadimos una excepción con la siguiente declaración.
                    throw new Error("La lista no existe") //Esta declaración interrumpe el código y no ejecuta lo demás.
                }
                return response.json(); //Si el status de response es "ok" retornamos el objeto en formato .json() para js pueda leerlo.
            })
            .then((data) => { //Data es un Objeto "json"(las tareas que hemos escrito en el TODO`S).
                setTodos(data.todos); //"setTodos" actualiza "todos" con la "data" obtenida de "json".(actualiza la lista de tareas con las tareas).
                console.log(data.todos); //Podemos ver cuales son esas tareas.
            })
            .catch((err) => { //Si surge algún error ".cath()" lo captura.
                if (err.message === "La lista no existe") { //Si la lista de tareas no existe, llamamos "createdTodoList"(crea la lista de tareas).
                    createdTodoList();
                } else {
                    console.error(err); //Si la lista existe pero hay un error "console.error(err)" nos lo muestra en la consola.
                }
            });
    }
    //Función que agrega las tareas al servidor.
    function addTodo() {
        let newTodo = { //Creamos un objeto que tiene tiene como propiedad "label" que posee el valor actual del campo de entrada "inputValue".
            label: inputValue, //"label:" contendrá la tarea. "inputValue" será la tarea(una vez escrita y haberle dado a "Enter").
            is_done: true //Puramente estético.
        }
        fetch(urlTodos + "todos/Elroro23", { //Solicitamos al servidor agregar tareas a nuestro TODO`S.
            method: "POST",  //Vamos agregar tareas al servidor por eso utilizamos "post".
            body: JSON.stringify(newTodo), //Convertimos nuestro objeto "newTodo" js a "json" para que el servidor pueda leerlo.
            headers: {
                "Content-Type": "application/json" //Especifícamos el tipo de contenido que estamos enviando en el body(json).
            }
        })
            .then(response => response.json()) //Convierte la respuesta a un objeto "json".
            .then(() => { //No utilizamos el resultado ya que no nos interesa porque estamos enviando información.
                getTodos(); //Llama a "getTodos" para obtener la lista de tareas actualizada una vez añadida una tarea.
                setInputValue(""); //Limpiamos el campo de texto luego de ñadir una tarea.
            })
            .catch((err) => { //Capturamos un error si es que lo hay.
                console.error(err); //Lo imprimimos en la consola.
            });
    }
    function deleteTodo(todoId) { //Función para eliminar una tarea.
        fetch(urlTodos + `todos/${todoId}`, { //Solicitamos al servidor eliminar una tarea por su "Id".

            method: "DELETE", //Con este método eliminamos la data.
        })
            .then(() => { //No necesitamos procesar datos adicionales por eso solo utilizamos un ".then()".
                if (!response.ok) { //Si response.ok es false mostramos la siguiente excepción.
                    throw new Error("Error deleting todo"); //Esta excepción interrumpe el código por eso no es necesario "ELSE"
                }
                console.log("Todo deleted successfully"); //Si response.ok es true mostramos el mensaje al eliminar la tarea.
                getTodos(); //Llamamos a "getTodos()" para actualizar la lista de tareas.
            })
            .catch((err) => { //Si hay error lo capturamos.
                console.error(err); //Imprimimos el error en la consola.
            });
    }
//Función para crear la lista de tareas cuando esta no exista.
    function createdTodoList() {
        fetch(urlTodos + "users/Elroro23", { //Solicitamos añadir datos al servidor mediante el método "POST".
            method: "POST",
            body: JSON.stringify([]), //Añadimos un array vacío(lista de tareas).
            headers: {
                "Content-Type": "application/json" //Indicamos el contenido del body(formato json()).
            }
        })
            .then(response => response.json()) //Convertimos la respuesta en .json()

            .then(data => { //data es el objeto de la respuesta .json()
                console.log("Create response:" + data); //Avisamos con un console.log la captura de la respuesta.
                getTodos(); //Llamamos a "getTodos()" para obtener la lista actualizada desde el servidor.
            })
            .catch((err) => { //Si ocurre algún error lo capturamos y mostramos en la consola.
                console.error(err);
            })
    }

    //Función para agregar tareas a la lista que maneja un evento "onKeyDown".
    const handleKeyDown = (e) => { //Si le damos "Enter" y el campo de texto no está vacío llama a "addTodo()".
        if (e.key === "Enter" && inputValue.trim() !== "") {
            addTodo(); //Llamamos a "addTodo()" que agrega la tarea al servidor(objeto con la tarea que escribimos"inputValue").
        }
    };
    //Función para eliminar tarea mediante el "Id" de cada una.
    const handleDelete = (todoId) => { //Le pasamos el "todoId" como parámetro(representa el id de cada tarea que nos da el servidor cuando hacemos "get").
        deleteTodo(todoId) //Llamamos a la función para eliminar cada tarea con "todoId" como parámetro.
    };
    return (

        <div className="text-center container mt-5">
            <h1>TODO'S</h1>
            <label htmlFor="exampleInputEmail1" className="form-label"></label>
            <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                placeholder="What needs to be done?"
                value={inputValue} //Sincronizamos el valor del campo de texto con el estado para tener un mayor control.
                onChange={(e) => setInputValue(e.target.value)} //Actualiza el estado "inputValue" con el valor del campo de entrada(lo que se escribe).
                onKeyDown={handleKeyDown} // Llama a "handleKeyDown" cuando se presiona la tecla "Enter" en el campo de entrada(agrega la tarea).
            />
            {todos.map(todo => ( //Mapeamos cada tarea agregada y la mostramos en un div.
                <div key={todo.id} className="todo-list">
                    <p style={{ display: 'inline', marginRight: '10px' }}>{todo.label}</p> {/* Muestra la propiedad label del todo */}
                    <i className="fa-solid fa-trash"
                        onClick={() => handleDelete(todo.id)} //Pasamos el id de cada tarea a "handleDelete" para poder eliminarla al hacer click al icono.
                        style={{ cursor: 'pointer', color: 'red' }}></i>
                </div>
            ))}
        </div>
    );
}
export default TodoFetch;