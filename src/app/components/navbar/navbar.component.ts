import { Component, Input, OnInit } from "@angular/core";
import { StatusService } from "../../status.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  constructor(public status: StatusService) {
    // this.theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  }

  ngOnInit(): void {
    
    this.status.getConfiguration().subscribe(res => {
      this.response = res; 
      this.theme = "#" + this.response.configuration.mainColor;
      this.lenguages = this.response.configuration.i18n;
    });
  }

  response: any = {};

  // @Input() theme = "";
  // theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  // theme = "bg-[#22aaa2]";
  // theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  banner = /* this.status.response.configuration.banner | */ "#fff";
  theme = "";
  lenguages:Array<string> = [];
  showMobileMenu: boolean = false;

  setShowMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  changeTheme() {
    document.body.classList.toggle("dark");
  }
}
