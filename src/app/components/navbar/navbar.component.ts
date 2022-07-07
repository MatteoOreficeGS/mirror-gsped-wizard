import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "../../status.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  constructor(
    public service: StatusService,
    private router: Router,
    private http: HttpClient
  ) {
    // this.theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  }

  ngOnInit(): void {
    this.service.getConfiguration().subscribe((res) => {
      this.response = res;
      this.theme = "#" + this.response.configuration.mainColor;
      this.lenguages = this.response.configuration.i18n;
    });
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url.slice(1).split("?")[0];
    });
  }

  response: any = {};

  // @Input() theme = "";
  // theme = "bg-[" + this.service.response.configuration.mainColor + "]";
  // theme = "bg-[#22aaa2]";
  // theme = "bg-[" + this.service.response.configuration.mainColor + "]";
  banner = /* this.service.response.configuration.banner | */ "#abc";
  currentUrl = "";
  theme = "";
  lenguages: Array<string> = [];
  showMobileMenu: boolean = false;

  setShowMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  changeTheme() {
    document.body.classList.toggle("dark");
  }

  handleSetTranslations(lang: string) {
    this.currentUrl = this.router.url.slice(1).split("?")[0];
    this.router.navigate([this.currentUrl], { queryParams: { lang: lang } });
    console.log(lang);
    this.service.setTranslations(lang, "resi");
    // window.location.href = "/" + this.currentUrl + "?lang=" + lang;
  }
}
