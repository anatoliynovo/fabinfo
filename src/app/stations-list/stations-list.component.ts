import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Station } from '../shared/station.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-stations-list',
  templateUrl: './stations-list.component.html',
  styleUrls: ['./stations-list.component.css']
})
export class StationsListComponent implements OnInit {

  constructor(public apiService: ApiService, private spinner: NgxSpinnerService) { }

  edit = false;
  editIndex = null;
  showEditButton: boolean[] = [];
  stationName: string;
  stationListLength: any;
  newStationName: string;
  addStation = false;
  toggleCheckbox = false;
  selectedStationName: string;
  selectedStationID: string;
  selectedIndex: number;

  stations: Station[];

  ngOnInit() {

    // show loading progress
    this.spinner.show();

    // get all stations
    this.getStations();

    // get length of stations
    this.getLengthStations();

  }

  // Get all stations
  getStations(): void {
    this.apiService.getStations().subscribe(stations => {
      this.stations = stations;
      this.spinner.hide();
    });
  }

  // Get length of stations-list
  getLengthStations() {
    this.apiService.getStations().subscribe(length => {
      this.stationListLength = length;
      this.showEditButton = new Array(this.stationListLength.length).fill('true');
    });
  }

  // Remove stations on click
  onRemove(station, i) {
      this.apiService.deleteStation(station._id).subscribe(res => name, err => {
        console.log(err);
      });
      this.stations.splice(i, 1);
  }

  // Pass old value for change
  onEdit(name, i) {
    if (this.showEditButton[i]) {
    this.showEditButton.fill(true, 0, this.showEditButton.length);
    this.showEditButton[i] = false;
    }
    this.edit = true;
    this.editIndex = i;
    this.stationName = name;
    console.log(name, i);
  }

  // After confirmation, the entered (new) value is accepted
  onChange(name, i) {
    this.apiService.putStation(this.stationName, name).subscribe(res => name, err => {
      console.log(err);
    });
    this.showEditButton[i] = true;
    this.edit = false;
    this.editIndex = null;
    console.log(name, i);
  }

  // Show input field on click --> "Add Station" Button
  onAdd() {
    this.addStation = true;
  }

  // Input value saved on click --> "Check-Icon" Button
  onSubmit() {
    const name = {name: this.newStationName};
    this.postStation(name);
  }

 // Create new station and reload after post
   postStation(newStation: any) {
    this.apiService.postStation(newStation).subscribe(res => {
      newStation = res;
      this.ngOnInit();
    });
    this.stations.push(newStation);
    this.addStation = false;
  }

  onClose() {
    this.addStation =  false;
  }




}
