import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
})
export class StartComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
    // if (window.location.href.split("?").length < 2 || false) {
    //   window.location.href = "http://localhost:4200/?origin=moldavia";
    // }
    this.route.queryParams.subscribe((params: any) => {
      if (!params.origin) {
        this.router.navigate(["/error-page"], {
          queryParams: { lang: params.lang ? params.lang : "it_IT" },
        });
      }
    });
  }
}
