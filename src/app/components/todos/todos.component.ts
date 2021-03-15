import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    this.todos = []
    this.counter=0
    this.performed=0
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

  toggleDoneList (id:number, idTodo:number) {
    this.todos[idTodo].lists.map((v,i)=> {
      if (i==id){ 
        v.completed ? this.todos[idTodo].performed-=1 : this.todos[idTodo].performed+=1;
        v.completed = !v.completed;
      }
      return v;
    })
  }

  deleteTodo (id:number) {
    this.todos = this.todos.filter( (v, i) => i!==id)
  }

  deleteList(id:number, idTodo:number) {
    this.todos[idTodo].counter-=1
    if (this.todos[idTodo].lists[id].completed) this.todos[idTodo].performed-=1;
    this.todos[idTodo].lists = this.todos[idTodo].lists.filter( (v, i) => i!==id)
  }

  addTodo () {
    this.todos.push({
      name: this.inputTodo,
      lists: [],
      open: false,
      counter:0,
      performed:0,
    });
    this.inputTodo= "";
  }

  addList (id:number) {
    this.todos[id].lists.push({
      content:this.inputList,
      completed: false,
    });
    this.inputList= "";
    this.todos[id].counter+=1
  }
}