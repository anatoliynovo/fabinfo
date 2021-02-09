import { Safety } from 'src/app/shared/safety.model';
import { Sign } from 'src/app/shared/sign.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-warning-safety',
  templateUrl: './warning-safety.component.html',
  styleUrls: ['./warning-safety.component.css']
})

export class WarningSafetyComponent implements OnInit {

  constructor(public apiService: ApiService, public sanitizer: DomSanitizer, private router: Router) { }

  urlItems = 'data:application/pdf;base64,';
  urlSigns = 'data:image/png;base64,';

  items: Safety[];
  signs: Sign[];

  stationname: string;

  /*+ Dropdown +*/
  dropdownSettingsItems: IDropdownSettings;
  dropdownSettingsSigns: IDropdownSettings;

  /*+ Upload +*/
  filetoUpload: File = null;
  filePlaceholder = 'choose a file..';
  filePlaceholder2 = 'choose a file..';
  fileBase64 = '';

  /*+ Safety +*/
  dropdownList = [];
  selectedItems = [];
  editButton: boolean[] = [];
  addInfo = false;
  itemName: string;
  editIndexItem = null;
  editItem = false;

  /*+ Signs +*/
  dropdownList2 = [];
  selectedSigns = [];
  editButtonSign: boolean[] = [];
  addSign = false;
  signName: string;
  editIndexSign = null;
  editSign = false;

  ngOnInit() {
    this.getItems();
    this.getSigns();

    this.dropdownSettingsItems = {
      singleSelection: true,
      idField: 'file',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.dropdownSettingsSigns = {
      singleSelection: false,
      idField: 'image',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

  }

  onFileSelected(files: FileList) {
    this.filetoUpload = files.item(0);
    this.filePlaceholder = this.filetoUpload.name;
    this.filePlaceholder2 = this.filetoUpload.name;
    const reader = new FileReader();
    reader.readAsDataURL(this.filetoUpload);
    reader.onload = () => {
      this.fileBase64 = reader.result as string;
      this.fileBase64 = this.fileBase64.split(',')[1];
    };
  }

  showPDF() {
    this.stationname = this.router.url.split('/')[2];
    this.stationname = this.stationname.replace('%20', ' ');
    console.log(this.selectedItems);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.items.length; i++) {
      if (this.stationname === this.items[i].name) {
        this.onItemSelect(this.items[i]);
        console.log(this.selectedItems);
      }
    }
  }

  refresh() {
    setTimeout(() => {
    window.location.reload();
    }, 1000);
  }

  /*+************************* Safety Items ******************************+*/

  // Get all items
  getItems(): void {
  this.apiService.getItems().subscribe(items => {
    this.items = items;
    this.editButton = new Array(this.items.length).fill('true');
    this.dropdownList.push(items);
    console.log(this.items);
    this.showPDF();
  });
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    console.log(this.stationname);
    if (this.stationname === undefined) {
      this.selectedItems.pop();
    }

    console.log(this.selectedItems);
  }

  onAdd() {
    this.addInfo = true;
  }

  onSubmit() {
    const item = {
      name: this.itemName,
      file: this.fileBase64,
    };
    if (item.name === '' || item.file === '') {
      confirm('You must fill out the form to add new information.');
    } else {
    this.postItem(item);
    }
  }

  postItem(newItem: any) {
    this.apiService.postSafetyItem(newItem).subscribe(item => newItem = item);
    this.addInfo = false;
    this.refresh();
  }

  onEdit(item, i) {
    this.editItem = true;
    this.editIndexItem = i;
    this.editButton[i] = false;
    this.itemName = item.name;
    this.fileBase64 = item.image;
  }

  onChange(item, i) {
    const obj = {
      name: item.name,
      file: this.fileBase64
    };
    this.apiService.putSafetyItem(obj, this.itemName).subscribe(res => obj);
    this.refresh();
  }

  onRemove(item, i) {
    if (confirm('Are you sure to delete ' + '" ' + item.name + ' " ?')) {
        this.apiService.deleteSafetyItem(item._id).subscribe(res => item._id, err => {
          console.log(err);
        });
        this.refresh();
    }

  }

  onClose() {
    this.addInfo = false;
  }


  /*+************************* Signs ******************************+*/

  getSigns(): void {
    this.apiService.getSigns().subscribe(signs => {
      this.signs = signs;
      this.editButtonSign = new Array(this.signs.length).fill('true');
      this.dropdownList2.push(signs);
    });
    }

  onItemSelectSign(sign: any) {
  this.selectedSigns.push(sign);
  this.selectedSigns.pop();
  console.log(this.selectedSigns);
  }

  onAddSign() {
    this.addSign = true;
  }

  onCloseSign() {
    this.addSign = false;
  }

  onSubmitSign() {
    const sign = {
      name: this.signName,
      image: this.fileBase64,
    };
    if (sign.name === '' || sign.image === '') {
      confirm('You must fill out the form to add new sign.');
    } else {
    this.postSign(sign);
    }
  }

  postSign(newSign: any) {
    this.apiService.postSign(newSign).subscribe(sign => newSign = sign);
    this.addSign = false;
    this.refresh();
  }

  onEditSign(sign, i) {
    this.editSign = true;
    this.editIndexSign = i;
    if (this.editButtonSign[i]) {
    this.editButtonSign.fill(false, 0, this.editButtonSign.length);
    this.editButtonSign[i] = true;
    }
    this.signName = sign.name;
    this.fileBase64 = sign.image;
  }

  onChangeSign(sign, i) {
    const obj = {
      name: sign.name,
      image: this.fileBase64
    };
    this.apiService.putSign(obj, this.signName).subscribe(res => obj);
    this.refresh();
  }

  onRemoveSign(sign, i) {
    if (confirm('Are you sure to delete ' + '" ' + sign.name + ' " ?')) {
        this.apiService.deleteSign(sign._id).subscribe(res => sign._id, err => {
          console.log(err);
        });
        this.refresh();
    }

  }

}
