import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SaveStatusService {
  activeStep: number = 0;

  status: any = {
    sender: {
      name: "lorenzo",
      city: "udine",
      zipcode: "33100",
      state: "ud",
      country: "italia",
      email: "lorenzo@gmailcom",
      phone: "321321321",
      address: "via adroiano 12",
    },
  };

  constructor() {}

  greeting() {
    console.log("hello");
  }

  setStatus(status: any) {
    this.status.sender = status;
  }

  getStatus(): any {
    return this.status;
  }

  incrementStep() {
    this.activeStep += 1;
  }
  getActiveStep(): number {
    return this.activeStep;
  }
}
