import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  currentStep: number = 1;
  origin?: string;
  token: any;
  decodedToken: any;
  configuration: any = {};
  translations: any;
  countries: any;
  codiceSconto: string = "";
  isDocumentShipment?: boolean;
  hasReturnShipment?: boolean;
  hasPayment?: boolean;
  hasInvoice?: boolean;
  hasShipmentData?: boolean;
  modules?: any;
  sender: any = {
    // ESEMPIO
    // sender_name: "Mario Rossi Verdi",
    // sender_city: "Milan",
    // sender_cap: "20121",
    // sender_prov: "MI",
    // sender_country_code: "IT",
    // sender_email: "mail@gmail.com",
    // sender_phone: "3343343344",
    // sender_addr: "Via Dante 23",
    // sender_contact: "Societa' SPA",
  };
  recipient: any = {
    // ESEMPIO
    // rcpt_name: "Mario Rossi Verdi",
    // rcpt_city: "Verona",
    // rcpt_cap: "37138",
    // rcpt_prov: "VR",
    // rcpt_country_code: "IT",
    // rcpt_email: "mail2@gmail.com",
    // rcpt_phone: "3343343346",
    // rcpt_addr: "Via Pittagora 1",
    // rcpt_contact: "Societa' SPA",
  };
  senderExtras: any = {};
  recipientExtras: any = {};
  outwardCostExposure: any = [];
  returnCostExposure: any = [];
  outwardShipment: any = {};
  returnShipment: any = {};
  payloadShipment: any = {};
  outwardInsurance?: number;
  returnInsurance?: number;
  totale: any;
  invoice: any = {};
  invoiceType: string = "privato";
  chosenCourier: any = { outward: {}, return: {} };
  selectedProducts: any = null;
  productDestination: any;
  displayPayment: any;
  isLastModule: boolean = false;
  isSenderPrefilled?: boolean;
  beforePaymentSession: any;
  packages: any = [];
  noteSenderOnSender?: boolean;
  totalAmount?: number;
  goodType?: string;
  isAskDocument: boolean = false;
  stepForShipment: number = 0;
  action?: string;
  documentsNumber: number = 1;
  documentsFilesUploaded: any = [];
  documentsFilesUploadedData: any = [];
  isHomePickup: any = { enable: false };
}
