import { User } from '../../../classes/user.class';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar-provider.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
declare var $: any;

@Component({
  selector: 'app-sidebar-provider',
  templateUrl: './sidebar-provider.component.html',
  styleUrls: ['./sidebar-provider.component.scss']
})
export class SidebarProviderComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public dataSessionService : DataSessionService
  ) {}

  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  }

  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
}
