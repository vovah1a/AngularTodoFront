import { Component, OnInit } from '@angular/core';
import services from '../../services/services';
import {Todo} from './../../models/Todo'

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})
export class TodosComponent implements OnInit {

  todos:Todo[];
  counter:number;
  performed:number;

  inputTodo:string = ""
  inputList:string = ""
  inputScan:string = ""

  constructor() { }

  ngOnInit(): void {
    this.findTodo();
    this.counter=0
    this.performed=0
    
  }
  async findTodo() {
    this.todos=[];
    const response = await services.findTodo();
    response.data.forEach(data=>{
      this.todos.push(data)
      this.todos[this.todos.length-1].open=false;
      this.todos[this.todos.length-1].lists=[]
      this.findList(data.id, this.todos.length-1)
    })
  }
  async findList(id:string, nam:number) { 
    const response = await services.findList(id);
    response.data.forEach(data=>{
      this.todos[nam].lists.push(
        {
          id: data.id,
          content: data.content,
          completed: data.completed,
        })
    })
  }

  ngDoCheck(): void {
    this.counter=0;
    this.performed=0;
    this.todos.forEach((todo)=>{
      this.counter+=todo.counter;
      this.performed+=todo.performed
    })
  }

  toggleDoneTodo (id:number) {
    this.todos.map((v,i)=> {  
      if (i==id) v.open = !v.open;
      return v;
    })
  }

  toggleDoneList (idList:number, idTodo:number) {
    if(this.todos[idTodo].lists[idList].completed){
      this.completedList(idTodo, idList, false)
      this.todos[idTodo].performed-=1;
      this.todos[idTodo].lists[idList].completed= false;
    }
    else{
      this.completedList(idTodo, idList, true)
      this.todos[idTodo].performed+=1;
      this.todos[idTodo].lists[idList].completed= true;
    }
  }
  async completedList(idtodo:number, idlist:number, completed:boolean) { 
    const response = await services.completedList({
      idTodo: this.todos[idtodo].id,
      idList: this.todos[idtodo].lists[idlist].id,
      completed:completed
    });
  }

  deleteTodo (id:string) {
    this.removedTodo(id)
    this.todos = this.todos.filter( (v, i) => id!==v.id)
  }
  async removedTodo(id:string) {
    const response = await services.removedTodo(id);
  }

  deleteList(id:number, idTodo:number) {
    this.todos[idTodo].counter-=1
    this.removedList(this.todos[idTodo].id, this.todos[idTodo].lists[id].id)
    if (this.todos[idTodo].lists[id].completed) this.todos[idTodo].performed-=1;
    this.todos[idTodo].lists = this.todos[idTodo].lists.filter( (v, i) => i!==id)
  }
  async removedList(idtodo:string,idlist:string) {
    const response = await services.removedList({
      idTodo: idtodo,
      idList: idlist,
    });
  }


  addTodo () {
    this.todos.push({
      id:"",
      name: this.inputTodo,
      lists: [],
      open: false,
      counter:0,
      performed:0,
    });
    this.newTodo();
    this.inputTodo= "";
  }
  async newTodo() {
    const response = await services.newTodo({
      name: this.todos[this.todos.length-1].name,
      counter: this.todos[this.todos.length-1].counter,
      performed: this.todos[this.todos.length-1].performed,
    });
    this.todos[this.todos.length-1].id=response.data.id;
  }

  addList (id:number) {
    this.todos[id].lists.push({
      id:"",
      content:this.inputList,
      completed: false,
    });
    this.newList(id);
    this.inputList= "";
    this.todos[id].counter+=1
  }
  async newList(id:number) {
    const response = await services.newList({
      id: this.todos[id].id,
      content: this.todos[id].lists[this.todos[id].lists.length-1].content,
    });
    this.todos[id].lists[this.todos[id].lists.length-1].id=response.data.id;
  }

  scanTodo() {
    if(this.inputScan == "") {
      this.findTodo()
    }
    else {
      this.todos = this.todos.filter(todo=>{
        todo.lists = todo.lists.filter(
          list=>list.content==this.inputScan
        )
        return todo.lists.length > 0
      })
    }
    this.inputScan=""
  }
}