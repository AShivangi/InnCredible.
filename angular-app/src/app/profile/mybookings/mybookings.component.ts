import { Component, OnInit} from '@angular/core';
import { UserProfileService } from '../../services/profile.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.scss']
})

export class MybookingsComponent implements OnInit {
  public key: string;
  txt_comment: string;

  constructor(public userProfileService: UserProfileService) {
  }

  ngOnInit() {
  }

  setkey(value) {
    this.key = value;
  }

  setText() {
    this.txt_comment = (<HTMLTextAreaElement>document.getElementById('textarea')).value;
  } 
}
