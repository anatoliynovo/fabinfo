import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Material } from 'src/app/shared/material.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  constructor(public apiService: ApiService) {}

  materials: Material[];

  /*+ Materials +*/
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  filetoUpload: File = null;
  image = 'choose an image..';
  imageBase64 = '';

  editButton: boolean[] = [];
  edit: boolean[] = [];
  showImage: boolean[] = [];
  showUploadedImage: boolean[] = [];
  addMaterial = false;

  selectedValue = null;
  materialName: string;
  materialText: string;
  materialLink: string;
  materialLength: any;
  editIndexMaterial = null;
  editMaterial = false;
  /*+**********+*/

  ngOnInit() {
    this.getMaterials();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'image',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }

  // Get all materials
  getMaterials(): void {
    this.apiService.getMaterials().subscribe(materials => {
      this.materials = materials;
      this.editButton = new Array(this.materials.length).fill('true');
      this.edit = new Array(this.materials.length).fill('true');
      this.showImage = new Array(this.materials.length).fill('true');
      this.dropdownList.push(materials);
    });
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    this.selectedItems.pop();
    console.log(item);
    console.log(this.selectedItems);

    for (const i of this.dropdownList[0]) {
      for (let j = 0; j < this.selectedItems.length; j++ ) {
        if (i.name === this.selectedItems[j].name ) {
          this.selectedItems[j] = i;
        }

      }
    }
    console.log(this.selectedItems);
  }

  onItemDeSelect(item: any) {
    for (const i of this.dropdownList[0]) {
      for (let j = 0; j < this.selectedItems.length; j++ ) {
        if (i.name === this.selectedItems[j].name ) {
          this.selectedItems[j] = i;
        }
      }
    }
    console.log(this.selectedItems);
  }


  onSelectAll(items: any) {
  }

  onFileSelected(files: FileList) {
    this.filetoUpload = files.item(0);
    this.image = this.filetoUpload.name;
    const reader = new FileReader();
    if (this.filetoUpload) {
      const file: File = this.filetoUpload;
      const pattern = /image-*/;
      if (!file.type.match(pattern)) {
        alert('Invalid format');
        return;
      }
    }
    reader.readAsDataURL(this.filetoUpload);
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.imageBase64 = this.imageBase64.split(',')[1];
    };
  }

  onAdd() {
    this.addMaterial = true;
  }

  onSubmit() {
    const material = {
      name: this.materialName,
      image: this.imageBase64,
      text: this.materialText,
      link: this.materialLink
    };
    if (material.name === '' || material.image === '' || material.text === '' || material.link === '') {
      confirm('You must fill out the form to add a new material.');
    } else {
    this.postMaterial(material);
    }
  }

  postMaterial(newMaterial: any) {
    this.apiService.postMaterial(newMaterial).subscribe(material => newMaterial = material);
    this.addMaterial = false;
    this.refresh();
  }

  onEdit(material, i) {
    this.editMaterial = true;
    this.editIndexMaterial = i;
    if (this.editButton[i]) {
      this.editButton.fill(true, 0, this.editButton.length);
      this.edit.fill(true, 0, this.edit.length);
      this.editButton[i] = false;
      this.edit[i] = false;
      }

    this.materialName = material.name;
    this.imageBase64 = material.image;
  }

  onChange(material, i) {
    const obj = {
      name: material.name,
      image: this.imageBase64,
      text: material.text,
      link: material.link
    };
    this.apiService.putMaterial(obj, this.materialName).subscribe(res => obj);
    this.refresh();
  }

  onRemove(material, i) {
    if (confirm('Are you sure to delete ' + '" ' + material.name + ' " ?')) {
        this.apiService.deleteMaterial(material._id).subscribe(res => material._id, err => {
          console.log(err);
        });
    }
    this.refresh();
  }

  onClose() {
    this.addMaterial = false;
  }

  onRemoveImage(i) {
    this.showImage[i] = false;
    this.showUploadedImage[i] = true;

  }

  refresh() {
    setTimeout(() => {
    window.location.reload();
    }, 1000);
  }

}
