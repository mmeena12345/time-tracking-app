import React from 'react';
import { render } from 'react-dom';
import Calendar from 'react-calendar';

const Title = ({todoCount}) => {
  return (
    <div>
       <div>
          <h1>Task List ({todoCount})</h1>
       </div>
    </div>
  );
}

const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
      }}>
      <input className="form-control col-md-12" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};

const SearchForm = ({searchValue}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        searchValue(input.value);
        input.value = '';
      }}>
      <input className="form-control col-md-12" ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};


const Todo = ({todo, ind, remove, isDisabled, showSave, showEdit, stopTask, edit, updateStartTimeStamp, save, time}) => {
  // Each Todo
  return (
    <div>
      <input 
        type='text' 
        required={true}
        name='publicLogoURL'
        placeholder={``}
        value={todo.val}
        disabled={isDisabled}
        onChange={edit}
        style={{marginBottom:'10px'}}
      />
      <span style={{marginLeft:'10px', marginRight:'10px'}}>
        {
          todo.time.hours
        }: {
          todo.time.minutes
        }: {
          todo.time.seconds
        }. {
          todo.time.milliseconds
        }
      </span>
      <button style={showSave ? {display:'none', marginLeft:'10px'} : {marginLeft:'10px'}} onClick={() => {save(ind)}}>Save</button>
      <div style={{display:'flex', marginBottom:'10px'}}>
        <div style={{marginRight:'5px'}}><button onClick={() => {updateStartTimeStamp(ind)}}>Start</button></div>
        <div style={{marginRight:'5px'}}><button onClick={() => {stopTask(ind)}}>End</button></div>
        <div style={{marginRight:'5px'}}><button onClick={() => {showEdit(ind)}}>Edit</button></div>
        <div style={{marginRight:'5px'}}><button onClick={() => {remove(ind)}}>Delete</button></div>
      </div>
    </div>
  );
}

const TodoList = ({todos, remove, isDisabled, showEdit, stopTask, edit, updateStartTimeStamp, save, time}) => {
  // Map through the todos
  const todoNode = todos.map((todo,index) => {
    return (<Todo todo={todo} ind={index} remove={remove} isDisabled={todo.isDisabled} showSave={todo.showSave} showEdit={showEdit} stopTask={stopTask} edit={edit} updateStartTimeStamp={updateStartTimeStamp} save={save} time={time}/>)
  });
  return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

const Node = ({val}) => {
  return(
    <div>{val}</div>
  )
}

const SearchList = ({list}) => {
  const searchedNode = list && list.map((todo,index) => {
    return (<Node val={todo.val}/>)
  });
  return (<div className="list-group" style={{marginTop:'30px'}}>{searchedNode && searchedNode.length>0 ? searchedNode : "NO DATA FOUND"}</div>);
}

// Contaner Component
// Todo Id
window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: [],
      searchData: [],
      isDisabled: true,
      currInd:0,
      duration: 0,
      searchByName:true,
      searchByTime:false
    }
    this.startTimer = this.start.bind(this);
  }

  msToTime(duration) {
    let milliseconds = parseInt((duration % 1000));
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    milliseconds = milliseconds.toString().padStart(3, '0');

    return {
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }

  // Lifecycle method
  componentDidMount(){
   
  }

  start(ind) {
    const remainder = this.state.data.filter((todo,index) => {
      if(index === ind) {
        todo.timer =  window.setInterval(() => this.run(ind), 10);
      }
      return todo;
    });
    this.setState({
      startTime: Date.now(),
      todo: remainder
    })
  }

  run(ind) {
    const diff = Date.now() - this.state.startTime;
    let remaining = diff;

    if (remaining < 0) {
      remaining = 0;
    }

    const remainder = this.state.data.filter((todo,index) => {
      if(index === ind) {
        todo.time = this.msToTime(remaining);
        if (remaining === 0) {
          window.clearTimeout(todo.timer);
          todo.timer = null;
        }
      }
      return todo;
    });
    this.setState({ data : remainder});
  }

  // Add todo handler
  addTodo = (val) => {
    // Assemble data
    let obj={};
    obj.val = val;
    obj.startTime = new Date();
    obj.endTime = new Date();
    obj.isDisabled = true;
    obj.showSave = true;
    obj.time = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      timer: null
    }
    this.state.data.push(obj);
    this.setState({data: this.state.data});
  }
  // Handle remove
  handleRemove = (id) => {
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo,index) => {
      if(index !== id) return todo;
    });
    // Update state with filter
    this.setState({data: remainder});
  }

  updateStartTimeStamp = (ind) => {
    const remainder = this.state.data.filter((todo,index) => {
      if(index === ind){
        todo.startTime = new Date();
      };
      return todo;
    });
    this.startTimer(ind);
    // Update state with filter
    this.setState({data: remainder});
  }

  stopTask = (ind) => {
    const remainder = this.state.data.filter((todo,index) => {
      if(index === ind){
        todo.endTime = new Date();
        clearInterval(todo.timer);
      };
      return todo;
    });
    // Update state with filter
    this.setState({data: remainder});
  }

  edit = (e) => {
    const remainder = this.state.data.filter((todo,index) => {
      if(index === this.state.currInd){
        todo.val = e.target.value;
      };
      return todo;
    });
    // Update state with filter
    this.setState({data: remainder});
  }

  showEdit = (ind) => {
    const remainder = this.state.data.filter((todo,index) => {
      if(index === ind){
        todo.isDisabled = false;
        todo.showSave = false;
      };
      return todo;
    });
    // Update state with filter
    this.setState({
      data: remainder,
      currInd: ind
    })
  }

  save = (ind) => {
    const remainder = this.state.data.filter((todo,index) => {
      if(index === ind){
        todo.isDisabled = true;
        todo.showSave = true;
      };
      return todo;
    });
    // Update state with filter
    this.setState({
      data: remainder,
      currInd: ind,
    })
  }

  onChange = (e) => {
    let miliTime = e.getTime();
    const remainder = this.state.data.filter((todo,index) => {
      let time = todo.startTime;
      if(time.getTime() <= miliTime){
       return todo;
      }
    });
    this.setState({
      searchData: remainder
    })
  }

  nameSearchClick = () => {
    this.setState({
      searchByName:true,
      searchByTime:false,
      searchData:[]
    })
  }

  timeSearchClick = () => {
    this.setState({
      searchByName:false,
      searchByTime:true,
      searchData:[]
    })
  }

  searchValue = (val) => {
    const remainder = this.state.data.filter((todo,index) => {
      let str = todo.val.toLowerCase();
      let searchStr = val.toLowerCase();
      if(str.includes(searchStr)){
       return todo;
      }
    });
    this.setState({
      searchData: remainder
    })
  }

  render(){
    // Render JSX
    const { time, searchByName, searchByTime } = this.state;
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div style={{width:'280px'}}>
            <div>  
              <span>Create Task:</span>
              <TodoForm addTodo={this.addTodo}/>
            </div>
            <Title todoCount={this.state.data.length}/>
            <TodoList
              todos={this.state.data}
              isDisabled={this.state.isDisabled} 
              remove={this.handleRemove}
              updateStartTimeStamp={this.updateStartTimeStamp}
              stopTask={this.stopTask}
              edit={this.edit}
              showEdit={this.showEdit}
              save={this.save}
              time={time}
            />
          </div>
          <div style={{marginLeft: '300px'}}>
            <span>Search Task</span>
            <div style={{display:'flex',marginTop:'10px'}}>
              <div style={{marginRight:'20px'}}>
                <button style={{marginBottom:'10px'}} onClick={this.nameSearchClick}>Search By Name</button>
                {searchByName &&
                <SearchForm searchValue={this.searchValue}/>
                }
              </div>
              <div>
                <button onClick={this.timeSearchClick}>Search By Time</button>
                { searchByTime &&
                <div style={{width:'300px', height:'150px'}}>
                  <Calendar
                    onChange={this.onChange}
                  />
                </div>
                }
              </div>
            </div>
            <SearchList
              list={this.state.searchData}
            />
          </div>
        </div>
      </div>
    );
  }
}
render(<TodoApp />, document.getElementById('root'));

