import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from './shared/user.model';
import { Router } from '@angular/router';
import { Device } from './shared/device.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  selectedUser: User = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  /********************************* STATIONS *******************************************/

  // POST Station (add new station to DB) --> CREATE
  postStation(newStation: any) {
    return this.http.post(environment.baseUrl + '/stations', newStation);
  }

  // Get all stations (like 3D-Printer, Millings etc.) --> READ
  getStations(): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl + '/stations');
  }

  // PUT station in editor (change station name) --> UPDATE
  putStation(station: any, newName) {
    return this.http.put(environment.baseUrl + '/stations/' + station, {
      name: newName
    });
  }

  // Delete station in editor --> DELETE
  deleteStation(station: any) {
    console.log(environment.baseUrl + '/stations/' + station);
    console.log(station);
    return this.http.delete(
      environment.baseUrl + '/stations/' + station
    );
  }

  /********************************* DEVICES *******************************************/

  // POST Device (add new device to station) --> CREATE
  postDevice(newDevice: any) {
    console.log(newDevice);
    const stationName = this.router.url.split('/')[2];
    return this.http.post(
      environment.baseUrl + '/stations/' + stationName,
      newDevice
    );
  }

  postCloneDevice(clonedDevice: any, clonedName: string) {
    clonedDevice.name = clonedName;
    console.log(clonedDevice);
    const stationName = this.router.url.split('/')[2];
    return this.http.post(
      environment.baseUrl + '/stations/clone/' + stationName,
      clonedDevice
    );
  }

  // Get all devices of stations (like Ultimaker, Makerbot etc.) --> READ
  getDevices(): Observable<any[]> {
    const name = this.router.url.split('/')[2];
    console.log(environment.baseUrl + '/stations/' + name);
    return this.http.get<any[]>(environment.baseUrl + '/stations/' + name);
  }

  // Get one device with content --> READ
  getDevice(): Observable<Device[]> {
    const name = this.router.url.split('/')[2];
    const dname = this.router.url.split('/')[3];
    console.log(environment.baseUrl + '/stations/' + name + '/' + dname);
    return this.http.get<any>(
      environment.baseUrl + '/stations/' + name + '/' + dname
    );
  }

  // PUT device in editor (change device name) --> UPDATE
  putDevice(device: any, newName: any, img: any) {
    const stationName = this.router.url.split('/')[2];
    return this.http.put(
      environment.baseUrl + '/stations/' + stationName + '/' + device,
      { name: newName, image: img }
    );
  }

  // Delete device in editor --> DELETE
  deleteDevice(device: any) {
    const stationName = this.router.url.split('/')[2];
    return this.http.delete(
      environment.baseUrl + '/stations/' + stationName + '/' + device
    );
  }

  /********************************* Device-View *******************************************/

   // ------------------------------- Overview ---------------------------------------- //

   postImage(img: File) {
    const formData: FormData = new FormData();
    formData.append('file', img, img.name);

    const stationName = this.router.url.split('/')[2];
    const devicesName = this.router.url.split('/')[3];
    return this.http.post(
      environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/upload/overview',
      formData
    );
   }

   deleteImage(img: any) {
    const stationName = this.router.url.split('/')[2];
    const devicesName = this.router.url.split('/')[3];
    return this.http.delete(
      environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/deleteOverview/' + img
    );
   }

   // ----------------------------- Materials -------------------------------- //

   // POST Material (add new material to device) --> CREATE
   postMaterialToDevice(newMaterial: any) {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    console.log(newMaterial);
    return this.http.post(
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/material',
      newMaterial
    );
  }

    // Get ALL material Elements in device view --> READ
    getMaterialListLength(): Observable<any[]> {
      const stationName = this.router.url.split('/')[2];
      const deviceName = this.router.url.split('/')[3];
      console.log(stationName);
      console.log(deviceName);
      console.log(environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/material');
      return this.http.get<any[]>(environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/material');
  }

  changeMaterialInDeviceView(material: any, materialID: any, pos: any) {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    console.log(stationName);
    console.log(deviceName);
    // tslint:disable-next-line: max-line-length
    return this.http.put(environment.baseUrl + '/stations/' + stationName + '/' + deviceName +  '/changeMaterial',  {material, position: pos, materialId: materialID});
   }

   // Delete Material from device view --> DELETE
   deleteMaterialFromDevice(deleteMaterial: any) {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    console.log(stationName);
    console.log(environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/deleteMaterial/' + deleteMaterial);
    console.log(deleteMaterial);
    return this.http.delete(
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/deleteMaterial/' + deleteMaterial);
  }

  // -------------------------------- Workflow ---------------------------------------- //

  postWorkflow(newWorkflow: any) {
    const stationName = this.router.url.split('/')[2];
    const devicesName = this.router.url.split('/')[3];
    return this.http.post(
      environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/addWorkflow',
      newWorkflow
    );
  }
  getWorkflow(): Observable<any[]> {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.get<any[]>(environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/workflows');
  }

  putWorkflow(workflow: any, newName, pos: any) {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.put(
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/editWorkflow/' + workflow,
      { workflow: newName, position: pos }
    );
  }

  deleteWorkflow(workflowID: any) {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.delete(
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/deleteWorkflow/' + workflowID
    );
  }

  // ---- Workflow Step -- //

  postWorkflowStep(step: any) {
    const stationName = this.router.url.split('/')[2];
    const devicesName = this.router.url.split('/')[3];
    return this.http.post(
        environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/workflow/step',
        step
      );
  }

  getWorkflowStep(): Observable<any[]> {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    // tslint:disable-next-line: max-line-length
    return this.http.get<any[]>(environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/workflow/steps');
  }

  putWorkflowStep(step: any, workflowPosition: any, stepPosition: any) {
    const stationName = this.router.url.split('/')[3];
    const deviceName = this.router.url.split('/')[4];
    return this.http.put(
      // tslint:disable-next-line: max-line-length
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/editWorkflowStep/' + stepPosition + '/' + workflowPosition,
      step
    );
  }

  deleteWorkflowStep(step: any, workflow: any, workflowPosition: any) {
    console.log(step);
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.delete(
      // tslint:disable-next-line: max-line-length
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/deleteWorkflowStep/' + step + '/' + workflow + '/' + workflowPosition
    );
  }

  // ------------------------------- Manual ---------------------------------------- //

  postManual(newManual: any) {
    console.log(newManual);
    const stationName = this.router.url.split('/')[2];
    const devicesName = this.router.url.split('/')[3];
    return this.http.post(
      environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/addManual',
      newManual
    );
  }

  getManual(): Observable<any[]> {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.get<any[]>(environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/manuals');
  }

  putManual(manual: any, newName: any, pos: any) {
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.put(
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/editManual/' + manual,
      { manual: newName, position: pos }
    );
  }

  deleteManual(manual: any) {
    console.log(manual);
    const stationName = this.router.url.split('/')[2];
    const deviceName = this.router.url.split('/')[3];
    return this.http.delete(
      environment.baseUrl + '/stations/' + stationName + '/' + deviceName + '/deleteManual/' + manual
    );
  }

  /********************************** Materials *******************************************/

   // POST Station (add new station to DB) --> CREATE
   postMaterial(newMaterial: any) {
    console.log(newMaterial);
    return this.http.post(environment.baseUrl + '/materials', newMaterial);
 }

   // Get all materials --> READ
   getMaterials(): Observable<any[]> {
   return this.http.get<any[]>(environment.baseUrl + '/materials');
 }


 putMaterial(material: any, matName: any) {
  return this.http.put(environment.baseUrl + '/materials/' + matName, material);
 }

 // Delete station in editor --> DELETE
  deleteMaterial(materialID: any) {
  return this.http.delete(
    environment.baseUrl + '/materials/' + materialID
  );
}


/********************************** Safety *******************************************/

postSafetyItem(newItem: any) {
  return this.http.post(environment.baseUrl + '/safety', newItem);
}

   // Get all safety items --> READ
 getItems(): Observable<any[]> {
 return this.http.get<any[]>(environment.baseUrl + '/safety');
 }

 putSafetyItem(item: any, itemName: any) {
  return this.http.put(environment.baseUrl + '/safety/' + itemName, item);
 }

 deleteSafetyItem(itemID: any) {
  return this.http.delete(
    environment.baseUrl + '/safety/' + itemID
  );
 }

 /********************************** Signs *******************************************/

postSign(newSign: any) {
  return this.http.post(environment.baseUrl + '/signs', newSign);
}

   // Get all safety items --> READ
 getSigns(): Observable<any[]> {
 return this.http.get<any[]>(environment.baseUrl + '/signs');
 }

 putSign(sign: any, signName: any) {
  return this.http.put(environment.baseUrl + '/signs/' + signName, sign);
 }

 deleteSign(signID: any) {
  return this.http.delete(
    environment.baseUrl + '/signs/' + signID
  );
 }

 postSignInDevice(signs: any) {
  const stationName = this.router.url.split('/')[2];
  const devicesName = this.router.url.split('/')[3];
  return this.http.post(environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/signs',
      signs
    );
}

deleteSignInDevice(signID: any) {
  const stationName = this.router.url.split('/')[2];
  const devicesName = this.router.url.split('/')[3];
  return this.http.delete(
    environment.baseUrl + '/stations/' + stationName + '/' + devicesName + '/deleteSign/' + signID
  );
 }

  /********************************** LOGIN *******************************************/

  login(authCredentials: any) {
    return this.http.post(environment.baseUrl + '/auth', authCredentials);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  logged() {
    return localStorage.getItem('token');
  }

  /************************************************************************************/

}
