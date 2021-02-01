import { User } from '../../../classes/user.class';
import { Component, AfterViewInit, OnInit } from '@angular/core';


import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { ServerMessage } from '../../../classes/serverMessage.class';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
declare var $: any;

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];

  constructor(
    public dataSessionService: DataSessionService,
  ) { }

  
  ngOnInit() {}

  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  // End open close

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
}
