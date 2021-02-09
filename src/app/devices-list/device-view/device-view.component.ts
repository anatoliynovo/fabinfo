import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from '../../api.service';
import { Device } from 'src/app/shared/device.model';
import { Material } from 'src/app/shared/material.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


declare const $: any;

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css']
})
export class DeviceViewComponent implements OnInit {

  constructor(public apiService: ApiService, private router: Router, private spinner: NgxSpinnerService) {}

  deviceData: Device[] = [];

  // Arrow Button (for expand)
  visible = [false, false, false, false];

  // Edit Button
  edit = false;
  editIndex = null;
  /*+**********+*/

  /*+ Signs +*/
  dropdownSettingsSigns: IDropdownSettings;
  addSign = false;
  dropdownList2 = [];
  selectedSigns = [];
  urlSigns = 'data:image/png;base64,';
  stationname: string;

  addSignButton = true;
  closeSignButton = false;

  /*+ Overview +*/
  filetoUpload: File = null;
  imageNameOverview = 'choose an image..';
  /*+**********+*/

  /*+ Materials +*/
  booleanButton = false;
  dropdownList = [];
  selectedItems = [];
  selectedAllItems = [];
  dropdownSettings: IDropdownSettings;
  materials: any;
  materialLength: any;
  editButtonMaterial: boolean[] = [];
  showImage: boolean[] = [];
  showUploadedImage: boolean[] = [];
  editIndexMaterial = null;
  editMaterial = false;
  editInput: boolean[] = [];
  imageNameMaterial = 'choose an image..';
  imageBase64 = '';
  materialName: string;
  lengthOfAddedMaterial;
  /*+**********+*/

  /*+ Checklist +*/
  editButtonChecklist: boolean[] = [];
  addChecklist = false;
  newChecklist: string;
  checklistLength: any;
  checklistName: string;
  editIndexChecklist = null;
  editChecklist = false;
  /*+**********+*/

  /*+ Workflows +*/
  editButtonWorkflow: boolean[] = [];
  workflowArray: Device[] = [];
  addWorkflow = false;
  workflowName: string;
  newWorkflowName: any;
  workflowListLength: any;
  currentWorkflow: any;
  currentWorkflowPos: any;
  editWorkflow = false;
  editIndexWorkflow = null;
  checkpoint: number;

  // Steps
  editButtonStep: boolean[] = [];
  addStep = false;
  stepNumber: any;
  stepCheckpoint: any;
  stepText: any;
  imageBase64Steps = '';
  imageNameSteps = 'choose an image';
  newStepNumber: any;
  newDiscriptionText: any;
  workflowStepListLength: any;
  editStep: boolean[] = [];
  editIndexStep = null;
  showStepImage: boolean[] = [];
  showStepUploadImage: boolean[] = [];
  checkpointVisible: boolean[] = [];
  checkboxID: string;
  stepEdit: any;
  checkpointEdit: any;

  stepCheckpointArray = [];
  stepCheckpointNewArray = [];
  stepCheckpointButton: boolean[] = [];
  /*+**********+*/

  /*+ Manual +*/
  editButtonManual: boolean[] = [];
  manualArray: Device[] = [];
  addManual = false;
  manualName: string;
  newManualName: any;
  manualListLength: any;
  currentManualPos: any;
  editManual = false;
  editIndexManual = null;
  /*+**********+*/

  // toggle Button (expand button for the categories --> overview, materials, workflows, manuals) if clicked
  toggleCategories(button: any) {
    this.visible[button] = !this.visible[button];
  }

  toggleCheckpoint(button: any) {
    this.checkpointVisible[button] = !this.checkpointVisible[button];
  }

  ngOnInit() {

    // show loading progress
    this.spinner.show();

    // Get all device data
    if (!this.apiService.logged()) {
      this.getData();
    } else {
      this.getDataEditor();
    }

    this.getSigns();

    // Boolean for Buttons
    this.getManualListLength();
    this.getWorkflowListLength();
    this.getWorkflowStepListLength();
    this.getLengthMaterialList();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'image',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };

    this.dropdownSettingsSigns = {
      singleSelection: false,
      idField: 'image',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
    };

    this.stationname = this.router.url.split('/')[2];
    this.stationname = this.stationname.replace('%20', ' ');

  }

  /******************************* Main Functions ***********************************/

  getData() {
    this.apiService.getDevice().subscribe((data: Device[]) => {
      // tslint:disable-next-line: no-string-literal
      this.deviceData.push(data['devices']);
      this.spinner.hide();
    });
  }

  getDataEditor() {
    this.apiService.getDevice().subscribe((data: Device[]) => {
      // tslint:disable-next-line: no-string-literal
      this.deviceData.push(data['devices']);
      this.manualArray.push(this.deviceData[0][0].manual);
      this.workflowArray.push(this.deviceData[0][0].workflows);
      this.spinner.hide();
    });
  }

  /*********************************************************************************/

  /************************************ EDITOR *************************************/

  getSigns(): void {
    this.apiService.getSigns().subscribe(signs => {
      this.dropdownList2.push(signs);
    });
    }

  onAddSign() {
    this.addSign = true;
    this.addSignButton = false;
    this.closeSignButton = true;
  }

  onCloseSign() {
    this.addSign = false;
    this.closeSignButton = false;
    this.addSignButton = true;
  }

  onItemSelect2(sign: any) {
    this.selectedSigns.push(sign);
    this.selectedSigns.pop();
    console.log(this.selectedSigns);
    }

  postSign(newSigns: any) {
  this.apiService.postSignInDevice(newSigns).subscribe(sign => newSigns = sign);
  this.addSign = false;
  this.refresh();
  }

  onRemoveSign(sign) {
    if (confirm('Are you sure to delete ' + '" ' + sign.name + ' " ?')) {
        this.apiService.deleteSignInDevice(sign._id).subscribe(res => sign._id, err => {
          console.log(err);
        });
        this.refresh();
    }

  }

  /************************************ Overview ***********************************/

  onFileSelectedOverview(files: FileList) {
    this.filetoUpload = files.item(0);
    this.imageNameOverview = this.filetoUpload.name;
  }

  uploadImage() {
    if (this.filetoUpload) {
      const file: File = this.filetoUpload;
      const pattern = /image-*/;
      if (!file.type.match(pattern)) {
        alert('Invalid format');
        return;
      }
    }
    this.apiService.postImage(this.filetoUpload).subscribe(data => {
    console.log(data);
    }, err => {
      console.log(err);
    });
    this.refresh();
  }

  onRemoveImage(index) {
    if (confirm('Are you sure to delete this image?')) {
      this.apiService.deleteImage(index).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
      this.refresh();
    }
  }

  /************************************ Materials **********************************/

   // Get length of material-list
   getLengthMaterialList() {
    this.apiService.getMaterialListLength().subscribe(length => {
      this.materialLength = length;
      this.lengthOfAddedMaterial = this.materialLength.length;
      console.log(this.lengthOfAddedMaterial);
      this.editButtonMaterial = new Array(this.materialLength.length).fill('true');
      this.showImage = new Array(this.materialLength.length).fill('true');
      this.getMaterials();
    });
  }

  getMaterials() {
    this.apiService.getMaterials().subscribe((materials: Material[]) => {
      this.materialLength.sort();
      console.log(materials.length);
      console.log(this.lengthOfAddedMaterial);
      for (let i = 0; i < this.lengthOfAddedMaterial; i++) {
        for (let j = 0; j < materials.length ; j++) {
          if (this.materialLength[i].name === materials[j].name) {
            materials.splice(j, 1);
            console.log(materials);
            console.log(this.materialLength);
            }
        }
      }
      this.dropdownList.push(materials);
      this.selectedAllItems = materials;
    });
  }

  onSubmitMaterial(material: any) {
    console.log(material);
    console.log(this.selectedItems);
    console.log(this.selectedItems.length);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.selectedItems.length; i++) {
      const element = this.selectedItems[i];
      console.log(element);
      this.apiService.postMaterialToDevice(element).subscribe(res => this.materials = res);
    }
    this.refresh();
  }

  onItemSelect(item: any) {
    this.booleanButton = true;
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
    this.booleanButton = true;
  }

  onRemoveMaterial(material: any, i) {
    console.log(i);
    console.log(material);
    console.log(this.selectedItems);
    if (confirm('Are you sure to delete ' + '" ' + material.name + ' " ?')) {
      this.apiService.deleteMaterialFromDevice(material._id).subscribe(res => material, err => {
        console.log(err);
      });
      this.deviceData[0][0].material.splice(i, 1);
    }
    this.refresh();
  }

  onEditMaterial(material, i) {
    this.editMaterial = true;
    this.editIndexMaterial = i;

    if (this.editButtonMaterial[i]) {
    this.editButtonMaterial.fill(true, 0, this.editButtonMaterial.length);
    this.editInput.fill(false, 0, this.editInput.length);
    this.editButtonMaterial[i] = false;
    this.editInput[i] = true;
    }

    this.materialName = material.name;
    this.imageBase64 = material.image;
  }


  onChangeMaterial(material, i) {
    const obj = {
      name: material.name,
      image: this.imageBase64,
      text: material.text,
      link: material.link
    };
    console.log(obj);
    console.log(this.materialName);
    this.apiService.changeMaterialInDeviceView(obj, this.materialName, i).subscribe(res => material, err => {
      console.log(err);
    });
    this.refresh();
  }

  onRemoveandChangeImage(i) {
    this.showImage[i] = false;
    this.showUploadedImage[i] = true;
    console.log(this.showImage[i]);
    console.log(this.showUploadedImage[i]);
  }

  onFileSelected(files: FileList) {
    this.filetoUpload = files.item(0);
    console.log(this.filetoUpload);
    this.imageNameMaterial = this.filetoUpload.name;
    console.log(this.imageNameMaterial);
    const reader = new FileReader();
    if (this.filetoUpload) {
      const file: File = files.item(0);
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

  /************************************ Workflows **********************************/

  getWorkflowListLength() {
    this.apiService.getWorkflow().subscribe(data => {
      this.workflowListLength = data;
      this.editButtonWorkflow = new Array(this.workflowListLength.length).fill('true');
      this.stepCheckpointButton = new Array(this.workflowListLength.length).fill('false');
    });
  }

  onSubmitWorklow() {
    const workflow = {name: this.newWorkflowName};
    this.postWorkflow(workflow);
    this.newWorkflowName = '';
  }

  postWorkflow(newWorkflow: any) {
    this.apiService.postWorkflow(newWorkflow).subscribe(res => {
      newWorkflow = res;
      this.ngOnInit();
    });
    this.workflowArray['0'].push(this.newWorkflowName);
    this.refresh();
  }

  onEditWorkflow(name, i) {
    this.editButtonWorkflow[i] = false;
    this.editWorkflow = true;
    this.editIndexWorkflow = i;
    this.workflowName = name;
    console.log(name, i);
  }

  onChangeWorkflow(name, i) {
    this.apiService.putWorkflow(this.workflowName, name, i).subscribe(res => name, err => {
      console.log(err);
    });
    this.editButtonWorkflow[i] = true;
    this.editWorkflow = false;
    this.editIndexWorkflow = null;
  }

  onRemoveWorkflow(name, id,  i) {
    if (confirm('Are you sure to delete ' + '" ' + name + ' " ?')) {
        this.apiService.deleteWorkflow(id).subscribe(res => id, err => {
          console.log(err);
        });
        this.workflowArray['0'].splice(i, 1);
    }
  }

  onAddWorkflow() {
    this.addWorkflow = true;
  }

  onCloseWorkflow() {
    this.addWorkflow = false;
  }

  currentWorkflowClicked(name: any, i) {
    this.currentWorkflow = name;
    this.currentWorkflowPos = i;
  }

  // Steps of each workflow

  getWorkflowStepListLength() {
    this.apiService.getWorkflowStep().subscribe(data => {
      this.workflowStepListLength = data;
      this.editButtonStep = new Array(this.workflowStepListLength.length).fill('true');
      this.editStep = new Array(this.workflowStepListLength.length).fill('true');
      this.showStepImage = new Array(this.workflowStepListLength.length).fill('true');
      this.checkpointVisible = new Array(this.workflowStepListLength.length).fill('true');
    });
  }

  onFileSelectedStep(files: FileList) {
    this.filetoUpload = files.item(0);
    this.imageNameSteps = this.filetoUpload.name;
    const reader = new FileReader();
    if (this.filetoUpload) {
      const file: File = files.item(0);
      const pattern = /image-*/;
      if (!file.type.match(pattern)) {
        alert('Invalid format');
        return;
      }
    }
    reader.readAsDataURL(this.filetoUpload);
    reader.onload = () => {
      this.imageBase64Steps = reader.result as string;
      this.imageBase64Steps = this.imageBase64Steps.split(',')[1];
    };
  }

  onEditStep(step, i) {
  this.editButtonStep[i] = false;
  this.editStep[i] = false;
  this.editIndexStep = i;
  }

  onRemoveImageStep(i) {
    this.showStepImage[i] = false;
    this.showStepUploadImage[i] = true;
  }

  onSubmitStep() {
    // tslint:disable-next-line: max-line-length
    const step = {
       number: this.stepNumber,
       image: this.imageBase64Steps,
       text: this.stepText,
       checkpoint: this.stepCheckpoint,
       workflow: this.currentWorkflow,
       position: this.currentWorkflowPos
    };
    this.postStep(step);
    this.stepNumber = '';
    this.stepText = '';
    this.stepCheckpoint = '';
  }

  onChangeStep(stepNumber, stepText, stepCheckpoint, stepImage, i) {
    const currentWorkflowPosition = this.currentWorkflowPos;
    const step = {
      number: stepNumber,
      image: this.imageBase64Steps || stepImage,
      text: stepText,
      checkpoint: stepCheckpoint
   };
    this.apiService.putWorkflowStep(step, currentWorkflowPosition, i).subscribe(res => step, err => {
      console.log(err);
    });
    this.refresh();
  }

  postStep(step: any) {
    this.apiService.postWorkflowStep(step).subscribe(res => {
      step = res;
    });
    this.addStep = false;
    this.refresh();

  }

  onRemoveStep(stepNumber: any, stepID: any) {
    const currentWorkflow = this.currentWorkflow;
    const currentWorkflowPosition = this.currentWorkflowPos;
    if (confirm('Are you sure to delete Step' + ' " ' + stepNumber + ' " ?')) {
      this.apiService.deleteWorkflowStep(stepID, currentWorkflow, currentWorkflowPosition).subscribe(res => stepNumber, err => {
        console.log(err);
      });
      this.refresh();
    }
  }

  onAddStep() {
    this.addStep = true;
  }

  onCloseStep() {
    this.addStep = false;
  }

  onCloseEditStep(i) {
    this.editButtonStep[i] = true;
    this.editStep[i] = true;
    this.showStepImage[i] = true;
    this.showStepUploadImage[i] = false;
  }

  getCheckpoint(stepId: any, obj, workflowPos) {
  const element = document.getElementById('customControlValidation' + stepId) as HTMLInputElement;
  console.log(this.stepCheckpointButton);

  if (element.checked) {
  this.stepCheckpointArray.push(stepId);
  console.log(this.stepCheckpointArray);
  } else {
    this.stepCheckpointNewArray = this.stepCheckpointArray.filter(checkpoint => checkpoint !== stepId);
    this.stepCheckpointArray = this.stepCheckpointNewArray;
    this.stepCheckpointButton[workflowPos] = true;
    console.log(this.stepCheckpointArray);
    }

  if (this.stepCheckpointArray.length === obj.steps.length) {
    this.stepCheckpointButton[workflowPos] = false;
    }

  }

  resetCheckpoints(obj, workflowPos) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.stepCheckpointArray.length; i++) {
      if (this.stepCheckpointArray[i] === obj.steps[i]._id) {
        const element = document.getElementById('customControlValidation' + obj.steps[i]._id) as HTMLInputElement;

        if (element.checked) {
          element.checked = false;
        }
      }
    }
    this.stepCheckpointButton[workflowPos] = true;
    this.stepCheckpointArray = [];
  }

  /************************************ Manual *************************************/

  getManualListLength() {
    this.apiService.getManual().subscribe(data => {
      this.manualListLength = data;
      this.editButtonManual = new Array(this.manualListLength.length).fill('true');
    });
  }

  onSubmitManual() {
    const manual = {link: this.newManualName};
    this.postManual(manual);
    this.newManualName = '';
  }

  postManual(newManual: any) {
    this.apiService.postManual(newManual).subscribe(res => {
      newManual = res;
      this.ngOnInit();
    });
    this.manualArray['0'].push(newManual);
    this.addManual = false;
  }

  onEditManual(name, i) {
    this.editButtonManual[i] = false;
    this.editManual = true;
    this.editIndexManual = i;
    this.manualName = name;
    console.log(name, i);
  }

  onChangeManual(name, i) {
    this.apiService.putManual(this.manualName, name, i).subscribe(res => name, err => {
      console.log(err);
    });
    this.editButtonManual[i] = true;
    this.editManual = false;
    this.editIndexManual = null;
    console.log(name, i);
  }

  onRemoveManual(linkID, link, i) {
  if (confirm('Are you sure to delete ' + '" ' + link + ' " ?')) {
      this.apiService.deleteManual(linkID).subscribe(res => link, err => {
        console.log(err);
      });
      this.manualArray['0'].splice(i, 1);
  }
}

  onAddManual() {
    this.addManual = true;
  }

  onCloseManual() {
    this.addManual = false;
  }

  /*********************************************************************************/

  refresh() {
    setTimeout(() => {
    window.location.reload();
    }, 1000);
  }
}


