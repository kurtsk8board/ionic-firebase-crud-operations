// home.page.ts
import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

interface SessionData {
  Date: string;
  Spot: string;
  Rating: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  sessionList = [];
  sessionData: SessionData;
  sessionForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder
  ) {
    this.sessionData = {} as SessionData;
  }

  ngOnInit() {

    this.sessionForm = this.fb.group({
      Date: ['', [Validators.required]],
      Time: ['', [Validators.required]],
      Spot: ['', [Validators.required]],
      Rating: ['', [Validators.required]]
    })

    this.firebaseService.read_sessions().subscribe(data => {

      this.sessionList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Date: e.payload.doc.data()['Date'],
          Time: e.payload.doc.data()['Time'],
          Spot: e.payload.doc.data()['Spot'],
          Rating: e.payload.doc.data()['Rating'],
        };
      })

    });
  }

  CreateRecord() {
    this.firebaseService.create_session(this.sessionForm.value)
      .then(resp => {
        //Reset form
        this.sessionForm.reset();
      })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_session(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditDate = record.Date;
    record.EditTime = record.Time;
    record.EditSpot = record.Spot;
    record.EditRating = record.Rating;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Date'] = recordRow.EditDate;
    record['Time'] = recordRow.EditTime;
    record['Spot'] = recordRow.EditSpot;
    record['Rating'] = recordRow.EditRating;
    this.firebaseService.update_session(recordRow.id, record);
    recordRow.isEdit = false;
  }

}
