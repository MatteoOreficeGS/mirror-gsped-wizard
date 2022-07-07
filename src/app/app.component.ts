import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "./status.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(public status: StatusService) {}
  ngOnInit(): void {
    this.status.setConfiguration();
    // this.status.setTranslations("it_IT", "resi");
  }
}
