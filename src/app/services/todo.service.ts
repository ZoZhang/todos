import {Injectable, OnInit} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {LocalStorageService} from './local-storage.service';

@Injectable()
export class TodoService {

  // initialie l'état filtre
  public todoListFiltreStatus: string;

  // initiale l'état items
  public todoListExistItem: boolean;

  // initiale l'état supprimé terminé
  public todoListExistItemDone: boolean;

  // todolist current position
  public  todoListPosition: number;

  // todolist localstorage key
  public localStorageHistoryKey: string;

  // todolist history table
  public todoListHistory:  Array<TodoListData>;

  // todolist current items by localstorage
  public todoListCurrentData: TodoListData;

  // todolist position localstorage key
  public localStoragePositionKey: string;

  // initialise l'état du toggle all
  public todoListSettingAllItemStatus = false;

  // todolis localStorage service
  public localStorage = new LocalStorageService;

  public myAngularxQrCode: string = null;

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );

  constructor() {
    this.todoListFiltreStatus = 'all';
    this.todoListExistItem = false;
    this.todoListExistItemDone = false;
    this.todoListSettingAllItemStatus = false;
    this.localStorageHistoryKey   = 'TodoList-Angular-History';
    this.localStoragePositionKey   = 'TodoList-Angular-Position';
    this.todoListPosition = this.getCurrentPositionLocalStorage();
    this.todoListHistory = this.getLocalStorage() || [];
    this.todoListCurrentData = this.getCurrentLocalStorage();

    if (this.todoListCurrentData) {
      this.todoListSubject.next(this.todoListCurrentData);
    }

    this.initialiseItemsStatus();
  }

  getTodoListDataObservable(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone, isDeleted: I.isDeleted}) )
    });

    this.toLocalStorage();
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone, isDeleted: I.isDeleted}) )
    });

    this.toLocalStorage();
  }

  appendItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();

    if (tdl.items === null) {
      tdl.items = [];
    }

    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]
    });

    this.toLocalStorage();
  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone: I.isDone, isDeleted: true}) )
    });

    this.toLocalStorage();
  }

  removeAllItems() {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.map(I => ({label: I.label, isDone: I.isDone, isDeleted: true}))
    });

    this.toLocalStorage();
  }

  // return all items by localstorage
  getLocalStorage() {

    const localStorageItems = this.localStorage.getItem(this.localStorageHistoryKey).getValue();

    if (localStorageItems !== null && 'object' === typeof localStorageItems) {
      return localStorageItems;
    }

    return [];
  }

  // save items to localStorage
  toLocalStorage() {
    const tdl = this.todoListSubject.getValue();

    if (!tdl.items.length) {
      return;
    }

    // synchroniser le position by LocalStorage
    const localStorageItems = this.getLocalStorage();
    if (localStorageItems !== null && this.todoListPosition !== localStorageItems.length) {
      this.todoListPosition = localStorageItems.length;
    } else {
      this.todoListPosition += 1;
    }

    this.todoListHistory.push(tdl);
    this.localStorage.setItem(this.localStorageHistoryKey, this.todoListHistory);
    this.localStorage.setItem(this.localStoragePositionKey, this.todoListPosition);

    this.initialiseItemsStatus();
  }

  // return current items by current position
  getCurrentLocalStorage() {

    const localStorageItems = this.getLocalStorage();

    if (localStorageItems !== null && 'object' ===  typeof localStorageItems[this.todoListPosition]) {
      this.todoListCurrentData = localStorageItems[this.todoListPosition];
    }

    return this.todoListCurrentData;
  }

  // return current position by localStorage
  getCurrentPositionLocalStorage() {

    const localStoragePosition = this.localStorage.getItem(this.localStoragePositionKey).getValue();

    if (localStoragePosition !== null && 'number' === typeof localStoragePosition) {
      this.todoListPosition = localStoragePosition;
    } else {
      this.todoListPosition = -1;
    }

    return this.todoListPosition;
  }

  // return current items by current position
  setCurrentPositionLocalStorage(position: number) {
    const localStoragePosition = this.localStorage.getItem(this.localStoragePositionKey).getValue();

    if (localStoragePosition !== null && 'number' === typeof localStoragePosition) {
      this.todoListPosition = position;
    } else {
      this.todoListPosition = localStoragePosition;
    }

    this.localStorage.setItem(this.localStoragePositionKey, this.todoListPosition);

    return this.todoListPosition;
  }

  initialiseItemsStatus() {

    const tdl = this.todoListSubject.getValue();

    if (tdl === null) {
        return;
    }

    // mise à jour l'état items
    this.todoListExistItem = tdl.items.filter((item) => {
      return item.isDeleted === false;
    }).length >= 1;

    this.todoListExistItemDone = tdl.items.filter((item) => {
      return item.isDone === true && item.isDeleted === false;
    }).length >= 1;

  }

  restoreTodoList(type: string) {

    // mise a jour le position items
    let [firstPos, lastPos] = [-1, 0];
    let currentPosition = this.getCurrentPositionLocalStorage();
    const currentAllItems = this.getLocalStorage();

    if (currentAllItems !== null) {
        firstPos = currentAllItems.length - currentAllItems.length - 1;
        lastPos = currentAllItems.length - 1;
    }

    if ('undo' === type) {
      currentPosition = (currentPosition - 1) < firstPos ? firstPos : (currentPosition - 1);

      if ((currentPosition - 1) > firstPos) {
        console.log('c\'est dèjà la début');
      }

    } else if ('redo' === type) {
      currentPosition = (currentPosition + 1) > lastPos ? lastPos : (currentPosition + 1);

      if ((currentPosition + 1) > lastPos) {
        console.log('c\'est dèjà la fin');
      }
    } else {
      console.log('il y a une exception d\'opération');
      return;
    }

    this.setCurrentPositionLocalStorage(currentPosition);

    // mise a jour current items list data
    const tdl = this.todoListSubject.getValue();
    const localStorageItems = this.getCurrentLocalStorage();

    if (currentPosition === -1) {
      this.todoListSubject.next( {
        label: tdl.label,
        items: []
      });
    } else if ('object' === typeof localStorageItems) {
      this.todoListSubject.next( {
        label: tdl.label,
        items: [...localStorageItems.items]
      });
    }

    this.initialiseItemsStatus();
  }

  // génère un qr-code
  genereQrcode() {
    const localStorageItems = this.getCurrentLocalStorage();

    if ('object' === typeof localStorageItems) {
      this.myAngularxQrCode = JSON.stringify(localStorageItems.items);
    } else {
      this.myAngularxQrCode = JSON.stringify(['votre Todolist est vide']);
    }
  }

  // nettoye le qr-code
  clearQrcode() {
    this.myAngularxQrCode = '';
  }

}
