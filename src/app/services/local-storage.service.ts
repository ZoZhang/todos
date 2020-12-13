import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {TodoListData} from '../dataTypes/TodoListData';
interface ICache { [ key: string ]: BehaviorSubject<any>; }

@Injectable()
export class LocalStorageService {
    private cache: ICache;

    constructor () {
        this.cache = Object.create( null );
    }

    setItem(key: string, value: Array<TodoListData> | number) {
        localStorage.setItem( key, JSON.stringify( value ) );

        if ( this.cache[ key ] ) {
            this.cache[ key ].next( value );
            return this.cache[ key ];
        }

        return this.cache[ key ] = new BehaviorSubject( value );
    }

    getItem( key: string ) {
        if ( this.cache[ key ] )
            return this.cache[ key ];
        else
            return this.cache[ key ] = new BehaviorSubject( JSON.parse( localStorage.getItem( key ) ) );
    }

    removeItem ( key: string ) {
        localStorage.removeItem( key );
        if ( this.cache[ key ] )
            this.cache[ key ].next( undefined );
    }
}
