import {Component, OnInit} from '@angular/core';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoService} from '../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  private todoList: TodoListData;

  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObservable().subscribe( tdl => this.todoList = tdl );

    const localStorageItems = this.todoService.localStorage.getItem(this.todoService.localStorageKey);

    if ('object' === typeof localStorageItems) {
        this.todoList.items = localStorageItems.getValue();
    }
  }

  ngOnInit() {
  }

  get items(): TodoItemData[] {

    switch (this.todoService.todoListFiltreStatus) {

      case 'all':
        return this.todoList.items.filter(item => item.label !== '');
        break;

      case 'active':
        return this.todoList.items.filter(item => item.isDone === false);
        break;

      case 'complet':
        return this.todoList.items.filter(item => item.isDone === true);
        break;
    }
  }

  changeMode(mode: string) {
    this.todoService.todoListModeStatus = mode;
  }

  itemDone(item: TodoItemData, done: boolean) {
    this.todoService.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, newLabel: string) {
     this.todoService.setItemsLabel(newLabel, item);
  }

  itemRemove(item: TodoItemData) {
    this.todoService.removeItems(item);
  }
}
