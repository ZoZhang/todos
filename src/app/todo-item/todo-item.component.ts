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

    this.todoService.initialiseItemsStatus();

    const localStorageItems = this.todoService.getLocalStorage();

    if ('object' === typeof localStorageItems) {
        this.todoList.items = localStorageItems.getValue();
    }
  }

  ngOnInit() {
  }

  get items(): TodoItemData[] {

    switch (this.todoService.todoListFiltreStatus) {

      case 'all':
        return this.todoList.items.filter(I => I.label !== '' && I.isDeleted === false);
        break;

      case 'active':
        return this.todoList.items.filter(I => I.isDone === false && I.isDeleted === false);
        break;

      case 'complet':
        return this.todoList.items.filter(I => I.isDone === true && I.isDeleted === false);
        break;
    }
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

  viewMode(item: TodoItemData, input: any) {
    input.className = 'hidden';
    this.itemLabel(item, input.value);
  }

  editMode(input: any, $event: MouseEvent) {
    input.className = 'edit editing';
    input.focus();
  }

}
