import {Component, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

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

    get items(): TodoItemData[] {
        return this.todoList.items;
    }

    appendItem(label: string) {
      this.todoService.appendItems({
        label, isDone: false
      });
    }

    itemDone(item: TodoItemData, done:boolean) {
      this.todoService.setItemsDone(done, item);
    }

    itemLabel(item: TodoItemData, newLabel:string) {
      this.todoService.setItemsLabel(newLabel, item);
    }

    itemDelete(item: TodoItemData) {
      this.todoService.removeItems(item);
    }

}
