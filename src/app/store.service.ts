import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  currentStep: number = 1;
  origin?:string;
  token: any;
  decodedToken: any;
  configuration: any;
  translations: any;
  codiceSconto: string = "";
  isDocumentShipment?: boolean;
  hasReturnShipment?: boolean;
  hasPayment?: boolean;
  modules?: any;
  sender: any = {
    //RIMUOVERE
    sender_name: "Mario Rossi Verdi Gialli",
    sender_city: "Milan",
    sender_cap: "26100",
    sender_prov: "MI",
    sender_country_code: "IT",
    sender_email: "mail@gmail.com",
    sender_phone: "3343343344",
    sender_addr: "Via Dante 23",
  };
  recipient: any = {};
  outwardShipment: any = {};
  returnShipment: any = {};
  payloadShipment: any = {}; 
  outwardInsurance: any;
  returnInsurance: any;
  totale:any;
  invoice:any;
  outwardShipmentID:any;
  returnShipmentID:any;
  chosenCourier:any;
}
