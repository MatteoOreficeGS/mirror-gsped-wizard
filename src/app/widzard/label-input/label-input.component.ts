import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-label-input",
  templateUrl: "./label-input.component.html",
  styleUrls: ["./label-input.component.css"],
})
export class LabelInputComponent implements OnInit {
  constructor() {
    console.log(this.fields);
  }

  ngOnInit(): void {}

  @Input() fields: any;
  @Input() label?: string;
  @Input() img?: string;

  showFields() {
    console.log(this.fields);
  }
}
