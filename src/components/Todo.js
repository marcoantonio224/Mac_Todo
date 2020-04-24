import React, {useState, useEffect} from 'react';
import {Button, Checkbox, Icon, Input, Loader} from 'semantic-ui-react';
import validator from 'validator';
import moment from 'moment'
import './Todo.css';

const date = moment().format("MMMM Do YYYY");
const time = moment().format("h:mm:ss a");

function TodoEngine(){
    // Initialize our state variables
    const [todo, setTodo] = useState('');
    const [loading, setLoading] = useState(false);
    const [realTime,setTime] = useState(time);
    const [todos, getTodos] = useState([]);
    const [search, setSearch] = useState('');
    const [notification,setNotification] = useState('');

    const savedItems = JSON.parse(window.localStorage.getItem('todo'));

    // Save todo item
    const saveTodo = (e)=>{
        e.preventDefault();
        // Validate to see if todo isnt an empty task
        if(validator.isAscii(todo.trim())){
            let items=[];
            
            if(savedItems === null){
                items = [
                    {
                        id:Math.floor(Math.random(99999)*232234),
                        todo,
                        completed:'false',
                        date:date,
                        time:time
                    }];
     
            }else{
                items = [
                        {
                            id:Math.floor(Math.random(99999)*2342342),
                            todo,
                            completed:'false',
                            date:date,
                            time:time
                        },
                        ...savedItems,
                    ];      
            }
            // Save items
            window.localStorage.setItem('todo', JSON.stringify(items));   
            setTodo("");
            createNotification({type:'save', notice:todo});
        } 
        else{
            alert('Insert a task');
        }
    }

    function loadItems(){
        setLoading(true);
        getTodos(savedItems);
        setLoading(false);
        setInterval(()=>setRealTime(),1000);
    }
    
    function clearItems(){
        window.localStorage.removeItem('todo');
        getTodos([]);
        createNotification({type:'clear'});
    }

    function removeTodo(todo){
        const items = savedItems.filter(item => item.id !== todo.id );

        window.localStorage.setItem('todo', JSON.stringify(items));
        getTodos(items);
        createNotification({type:'remove', notice:todo.todo});

    }

    function taskCompleted(todo){
       if(search.trim() === ''){
            const items = todos.map((item,idx,arr) => {
                if(item.id === todo.id){
                    item.completed = 'true';
                }
                return item
            });
            window.localStorage.setItem('todo', JSON.stringify(items));
            getTodos(todos);              
       } else{
            const elItem = savedItems.filter((item,idx,arr) => {
                if(item.id === todo.id){
                    item.completed = 'true';
                    return item
                }
            });
            window.localStorage.setItem('todo', JSON.stringify(savedItems));
            getTodos(elItem)
            
        }
        createNotification({type:'completed', notice:todo.todo});
    }

    function setRealTime(){
        const time = moment().format("h:mm:ss a");
        setTime(time);
    }

    function renderSearch(e){
        e.preventDefault();
        const search = e.target.children[0].children[0].value;
        setSearch(search);

        if(savedItems !== null){
            const result  = todos.filter((item,idx,arr)=> (item.todo === search)? item : false);
            // If there's a match, then render match. If not, then render original list
            (result.length > 0) ? getTodos(result) : getTodos(savedItems);
        }

    }

    function createNotification(item){
        let notification = '';
        const ele = document.getElementById('notification');

        switch (item.type){
            case 'save':
                notification = `'${item.notice}'  was saved!`;
                break;
            case 'remove':
                notification =`'${item.notice}'  was removed!`;
                break;
            case 'completed':
                notification = `'${item.notice}'  was completed!`;
                break;
            case 'clear':
                notification = 'All list items were cleared!';
                break;
            default:
                notification=''
                
        }

        setNotification(notification);
        const divBox = document.createElement('div');
        divBox.textContent = notification;
        divBox.setAttribute('class','fade-in');
        ele.insertBefore(divBox,ele.firstChild);
        setInterval(()=> divBox.setAttribute('class','fade-out'),3000)
    }

    //useEffect will load only once when component is mounted
    useEffect(()=>{
        loadItems(todos);
    },[todo]);
    
    return (
        <div>
        { (loading) ? <Loader active inline='centered' style={{marginTop:'5%;'}} /> :
            <div>
                <div id="notification"></div>
                <div >
                    <h3 style={{margin:'0%'}}>{date}</h3>
                    <h4 style={{margin:'0%'}}>{realTime}</h4>
                </div>
                <form className='inputForm'>                
                    <Input 
                        value={todo}
                        onChange={(e)=> setTodo(e.target.value)}
                        placeholder="Please insert a task..."
                        style={{width:'70%',marginBottom:'1%'}}
                    />
                    <Button 
                        inverted color="blue" 
                        onClick={e => saveTodo(e)}>Save</Button>
                </form>   
                <div className="listContainer">
                    <div className="listHeader">
                    <form onSubmit={e => renderSearch(e)}>
                        <Input 
                            list="search_results"
                            icon='search' 
                            placeholder='Search...' 
                            style={{float:'left',margin:'1%'}} 
                            /> 
                        
                        <datalist id="search_results">
                            {(todos === null || todos.length === 0)? 
                                <option>There are no items at this moment.</option>
                                :
                                todos.map((item,idx)=>
                                    <option key = {idx}>
                                        {item.todo}
                                    </option>                    
                            
                            )}
                        </datalist>                
                    </form>
                        <h3>Todo List</h3>
                        <Button inverted color="red" onClick={()=>clearItems()} className="clearBtn">Clear</Button>  
                    </div>
                    
                    <ul>
                        {
                            (todos === null || todos.length === 0) ? <h5>There are currently no items at the moment.</h5>  : 
                                todos.map((item,idx)=>
                                    <li key={idx} className="list">
                                        <div>
                                            <Checkbox 
                                                onClick={(e)=> taskCompleted(item)} 
                                                checked={ (item.completed === 'true' ) ? true: false }
                                                toggle
                                                />    
                                            <p>Completed</p>                                        
                                        </div>

                                        <p>{item.todo}</p>  
                                        <div>
                                            <p className="completed">Completed: <b> {item.completed} </b> </p>
                                        </div>
                                        <Icon name='trash' onClick={(e) => removeTodo(item)}/>    
                                    </li>
                                ) 
                        }
                    </ul>
                </div>
            </div>
            }
        </div>
    )
}

export default TodoEngine;