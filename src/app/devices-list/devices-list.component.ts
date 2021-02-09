import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Device } from '../shared/device.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.css']
})
export class DevicesListComponent implements OnInit {
  constructor(
    public apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}

  devices: Device[];

  edit = false;
  editIndex = null;
  showEditButton: boolean[] = [];
  deviceName: string;
  deviceListLength: any;
  newDeviceName: string;
  addDevice = false;
  changeClonedName: string;
  selectedDevice: any[];
  selectedDeviceName: string;
  selectedDeviceID: string;
  selectedIndex: number;

  filetoUpload: File = null;
  imageName = '';
  imageBase64 = '';

  ngOnInit() {

    // show loading progress
    this.spinner.show();

    // get all devices
    this.getDevices();

    // Get length devices-list
    this.getLengthDevices();
  }

  getDevices(): void {
    this.apiService.getDevices().subscribe(devices => {
      this.devices = devices;
      this.spinner.hide();
    });
  }

  // Get length of devices-list
  getLengthDevices() {
    this.apiService.getDevices().subscribe(data => {
      this.deviceListLength = data;
      this.showEditButton = new Array(this.deviceListLength.length).fill(
        'true'
      );
    });
  }

  onRemove(device: any, i) {
    this.apiService.deleteDevice(device._id).subscribe(
      res => name,
      err => {
        console.log(err);
      }
    );
    this.devices.splice(i, 1);
  }

  // Pass old value for change
  onEdit(name, i) {
    if (this.showEditButton[i]) {
      this.showEditButton.fill(true, 0, this.showEditButton.length);
      this.showEditButton[i] = false;
    }
    this.edit = true;
    this.editIndex = i;
    this.deviceName = name;
    console.log(name, i);
  }

  // After confirmation, the entered (new) value is accepted
  onChange(name, image,  i) {

    if (this.filetoUpload !== null) {
      image = this.imageBase64;
      this.refresh();
    }

    this.apiService.putDevice(this.deviceName, name, image).subscribe(
      res => name,
      err => {
        console.log(err);
      }
    );
    this.showEditButton[i] = true;
    this.edit = false;
    this.editIndex = null;
  }

  // Show input field on click --> "Add Device" Button
  onAdd() {
    this.addDevice = true;
  }

  // Input value saved on click --> "Check-Icon" Button
  onSubmit() {
    const device = {
      name: this.newDeviceName,
      image: this.imageBase64
    };
    this.postDevice(device);
    this.newDeviceName = '';
  }

  // Create new device and reload after post
  postDevice(newDevice: any) {
    this.apiService.postDevice(newDevice).subscribe(res => {
      newDevice = res;
      this.ngOnInit();
    });
    this.devices.push(newDevice);
    this.addDevice = false;
  }

  onClone(clonedDevice: any, clonedName: any) {
    console.log(clonedDevice.name);
    console.log(clonedName);
    this.apiService.postCloneDevice(clonedDevice, clonedName).subscribe(res => {
      clonedDevice = res;
    });
    this.devices.push(clonedDevice);
    console.log(clonedDevice);
    this.refresh();
  }

  onClose() {
    this.addDevice = false;
  }

  onFileSelected(files: FileList) {
    this.filetoUpload = files.item(0);
    this.imageName = this.filetoUpload.name;
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

  refresh() {
    setTimeout(() => {
    window.location.reload();
    }, 1000);
  }
}
