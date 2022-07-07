import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { StatusService } from "../status.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-start",
  templateUrl: "./start.component.html",
})
export class StartComponent {
  
}
