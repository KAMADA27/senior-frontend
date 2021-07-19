import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: any;

  constructor() { 
    this.storage = window.localStorage;
  }

  public set(key: string,  value: any): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): any {
    return JSON.parse(this.storage.getItem(key));
  }

  public remove(key: string): boolean {
    return this.storage.removeItem(key);
  }

  public clear(): boolean {
    return this.storage.clear();
  }
}
