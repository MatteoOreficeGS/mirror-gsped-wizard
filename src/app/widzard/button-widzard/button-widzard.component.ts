import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-button-widzard",
  templateUrl: "./button-widzard.component.html",
})
export class ButtonWidzardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() text = "";
}
