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
  }

  ngOnInit() {
  }

  get items(): TodoItemData[] {

    let listItems = this.todoList.items;
    switch (this.todoService.todoListFiltreStatus) {

      case 'all':
        listItems = this.todoList.items.filter(item => item.label !== '');
        break;

      case 'active':
        listItems = listItems.filter(item => item.isDone === false);
        break;

      case 'complet':
        listItems = listItems.filter(item => item.isDone === true);
        break;
    }

    return listItems;
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
