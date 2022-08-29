import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  currentStep: number = 1;
  origin?: string;
  token: any;
  decodedToken: any;
  configuration: any = {
    banner: "https://www.gsped.it/pubblica/returndhl/logodhltrasparente.png",
    footer: "https://www.gsped.it/pubblica/dummyconsolato.png",
    mainColor: "fff",
    vatPercentage: 22,
    i18n: ["it_IT", "en_US"],
    client_id: 12362,
    modules: [
      {
        moduleName: "sender",
        moduleConfig: {
          editable: true,
          hidden: false,
          autocomplete: true,
          label: "lbl_sender",
          data: {
            sender_name: "",
            sender_contact: "",
            sender_addr: "",
            sender_city: "",
            sender_cap: "",
            sender_prov: "",
            sender_country_code: "",
            sender_email: "",
            sender_phone: "",
          },
        },
      },
      {
        moduleName: "recipient",
        moduleConfig: {
          editable: true,
          hidden: false,
          autocomplete: true,
          label: "lbl_recipient",
          data: {
            rcpt_name: "",
            rcpt_contact: "",
            rcpt_addr: "",
            rcpt_city: "",
            rcpt_cap: "",
            rcpt_prov: "",
            rcpt_country_code: "",
            rcpt_email: "",
            rcpt_phone: "",
          },
        },
      },
      {
        moduleName: "fatturaDHL",
        moduleConfig: {
          enable: "true",
          label: "lbl_invoicing",
          private: { enable: "true", label: "lbl_invoice_private" },
          company: { enable: "true", label: "lbl_invoice_company" },
          foreign: { enable: "true", label: "lbl_invoice_foreign" },
        },
      },
      {
        moduleName: "shipment-data",
        moduleConfig: {
          documentFlag: "ask",
          hidden: false,
          label: "lbl_shipment",
          packagesDetails: {
            label: "colli",
            fieldsLabel: [
              "altezza",
              "larghezza",
              "lunghezza",
              "peso",
              "volume",
            ],
            fixedPackagesNumber: 5,
            enable: true,
          },
          insurance: { enable: true, label: "valore_andata" },
          returnLabel: {
            enable: false,
            insurance: { enable: true, label: "valore_ritorno" },
          },
        },
      },
      {
        moduleName: "courier-selection",
        moduleConfig: {
          label: "lbl_selectCourier",
          hidden: false,
          pickup: {
            dropoff: true,
            showServicePoints: true,
            pickup: true,
            pickupSameDayCheck: true,
          },
          selectCourier: {
            couriers: {
              selectionMode: "FIXED",
              list: [
                {
                  name: "DHL",
                  gspedCourierCode: 104,
                  logoUrl:
                    "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
                  services: {
                    list: [
                      {
                        gspedServiceCode: 0,
                        name: "Domestic Express",
                        domestic: 1,
                      },
                      {
                        gspedServiceCode: 1,
                        name: "Domestic Express H 12",
                        domestic: 1,
                      },
                      {
                        gspedServiceCode: 8,
                        name: "Economy Select",
                        domestic: 0,
                      },
                      {
                        gspedServiceCode: 9,
                        name: "Express Worldwide",
                        domestic: 0,
                      },
                    ],
                    label: "servizio",
                  },
                },
              ],
              label: "corriere",
            },
            returnCouriers: {
              selectionMode: "FIXED",
              couriers: {
                list: [
                  {
                    name: "DHL",
                    gspedCourierCode: 104,
                    logoUrl:
                      "https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg",
                    services: {
                      list: [
                        {
                          gspedServiceCode: 0,
                          name: "Domestic Express",
                          domestic: 1,
                        },
                        {
                          gspedServiceCode: 9,
                          name: "Express Worldwide",
                          domestic: 0,
                        },
                      ],
                      label: "servizio",
                    },
                  },
                ],
                label: "corriere",
              },
            },
          },
        },
      },
      {
        moduleName: "payment",
        moduleConfig: { label: "lbl_payment", provider: ["monetaweb"] },
      },
      {
        moduleName: "awb-printing",
        moduleConfig: {
          label: "lbl_awb_printing",
          directDownload: {
            enable: true,
            label: "lbl_download",
            text: "txt_download",
          },
          summary: true,
        },
      },
    ],
  };
  translations: any;
  countries: any;
  codiceSconto: string = "";
  isDocumentShipment?: boolean;
  hasReturnShipment?: boolean;
  hasPayment?: boolean;
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
  senderExtras: any = {};
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
  recipientExtras: any = {};
  outwardShipment: any = {};
  returnShipment: any = {};
  payloadShipment: any = {};
  outwardInsurance?: number;
  returnInsurance?: number;
  totale: any;
  invoice: any = {};
  invoiceType: string = "privato";
  chosenCourier: any;
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
  isGoodDocument: number = 1;
  isAskDocument: boolean = true;
}
