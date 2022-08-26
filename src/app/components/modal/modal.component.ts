import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
})
export class ModalComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() errors: any;
  @Output() closeModal = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
