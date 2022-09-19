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
  sender: any = {};
  senderExtras: any = {};
  recipient: any = {};
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
}
