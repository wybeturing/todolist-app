import { Injectable } from '@angular/core';
import {Checklist} from "../interfaces/checklists";
import {Storage} from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ChecklistDataService {

  public checklists: Checklist[] = [];
  public loaded: boolean = false;

  constructor(private storage: Storage) { }

  load(): Promise<boolean>{
    return new Promise(resolve => {
      this.storage.get('checklists').then(checklists => {
        if(checklists != null){
          this.checklists = checklists;
        }
        this.loaded = true;
        resolve(true);
      });
    });
  }

  createChecklist(data): void {

    this.checklists.push({
      id: this.generateSlug(data.name),
      title: data.name,
      items: []
    });

    this.save();
  }

  renameChecklist(checklist, data): void {

    let index = this.checklists.indexOf(checklist);

    if(index > -1){
      this.checklists[index].title = data.name;
      this.save();
    }
  }

  removeChecklist(checklist): void {

    let index = this.checklists.indexOf(checklist);

    if(index > -1){

      this.checklists.splice(index, 1);
      this.save();
    }
  }

  getChecklist(id): Checklist{

    return this.checklists.find(checklist => checklist.id === id);

  }

  addItem(checklistId, data): void {

    this.getChecklist(checklistId).items.push({
      title: data.name,
      checked: false
    });
    this.save();
  }

  removeItem(checklist, item): void {

    let index = checklist.items.indexOf(item);

    if(index > -1){
      checklist.items.splice(index, 1);
      this.save()
    }
  }

  renameItem(item, data): void {

    item.title = data.name;
    this.save();
  }

  toggleItem(item): void {

    item.checked = !item.checked;
    this.save();

  }

  save(): void{
    this.storage.set('checklists', this.checklists);
  }

  generateSlug(title):string{

    let slug = title.toLowerCase().replace(/\s+/g, '-');

    let exists = this.checklists.filter((checklist) => {
      return checklist.id.substring(0, slug.length) == slug;
    });

    if(exists.length > 0){
      slug = slug + exists.length.toString();
    }
    
    return slug;
  }

}
