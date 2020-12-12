import {Component, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoService} from '../services/todo.service';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

    private todoList: TodoListData;

    constructor(private todoService: TodoService) {
        todoService.getTodoListDataObservable().subscribe( tdl => this.todoList = tdl );
    }

    ngOnInit() {
    }

    get label(): string {
        return this.todoList.label;
    }

    get todoCount(): number {
        return this.todoList.items.filter(I => I.isDone === false && I.isDeleted === false).length;
    }

    itemShow(type: string) {
        this.todoService.todoListFiltreStatus = type;
    }

    setDoneAllItems() {
        this.todoService.todoListSettingAllItemStatus = !this.todoService.todoListSettingAllItemStatus;
        this.todoList.items.map(item => this.todoService.setItemsDone(this.todoService.todoListSettingAllItemStatus, item));
    }

    appendItem(input: any) {

      if (typeof input !== 'object') {
          return;
      }

      const newLabel = input.value;

      if (newLabel.length <= 0) {
          input.placeholder = 'Vous devez entrer au moins un caractère ！';
          return;
      }

      this.todoService.appendItems({
          label: newLabel,
          isDone: false,
          isDeleted: false
      });
    }

    itemDoneRemove() {
        this.todoList.items.filter(item => item.isDone === true && this.todoService.removeItems(item));
    }

    itemAllRemove() {
        this.todoService.removeAllItems();
    }
}
