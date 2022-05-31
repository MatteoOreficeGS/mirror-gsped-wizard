import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  response: any = {};

  initResponse() {
    this.response = {
      configuration: {
        title: "Reso Facile",
        banner:
          "https://it.return.alphatest.boxdrop.com/images/logo/nav-logo-dhl.png",
        bannerExtra:
          "https://it.return.alphatest.boxdrop.com/images/logo/consulate-of-america-milan.png",
        footer: "url",
        mainColor: "bg-[#ff0]",
        i18n: ["IT-it", "EN-en", "ZH-zh"],
        client_id: 123,
        modules: [
          {
            moduleName: "sender",
            editable: true,
            hidden: false,
            autocomplete: true,
            data: {},
          },
          {
            moduleName: "recipient",
            editable: false,
            hidden: false,
            autocomplete: false,
            data: {
              name: "Rossi Gino",
              address: "via dei tigli 12",
              city: "Milano",
              zipcode: "12345",
              state: "MI",
              country: "IT",
              email: "test@test.it",
              phone: "123445679",
            },
          },
          {
            moduleName: "shipment",
            couriers: [
              {
                name: "BRT",
                gspedCourierCode: 1,
                logoUrl: "url",
                services: [
                  {
                    gspedServiceCode: 0,
                    name: "Express",
                  },
                ],
                ancillaryServices: {
                  insurance: true,
                  cod: true,
                },
              },
            ],
            returnLabel: true,
            rating: true,
            packagesDetails: {
              fixedPackagesNumber: 1,
              enable: true,
            },
            pickup: {
              dropoff: true,
              showServicePoints: true,
              pickup: false,
              pickupSameDayCheck: false,
            },
          },
          {
            moduleName: "payment",
            provider: "monetaweb",
          },
          {
            moduleName: "awbPrinting",
            directDownload: true,
            summary: true,
          },
        ],
      },
    };

    /*  this.response = {
      configuration: {
        banner: "url",
        bannerExtra: "url",
        footer: "url",
        mainColor: "fff",
        i18n: ["IT-it", "EN-en", "ZH-zh"],
        client_id: 123,
        modules: [
          {
            moduleName: "customModuleVodafone",
            moduleConfig: {
              productList: [
                {
                  name: "Router bla bla",
                  image: "url immagine",
                  selectable: true,
                },
                {
                  name: "Televisione",
                  image: "url immagine",
                  selectable: true,
                },
                {
                  name: "Cellulare",
                  image: "url immagine",
                  selectable: true,
                },
              ],
              output: "concat_string",
              destination: "note_sender",
            },
          },
          {
            moduleName: "sender",
            moduleConfig: {
              editable: true,
              hidden: false,
              autocomplete: true,
              data: {
                sender_name: "",
                sender_contact: "",
                sender_address: "",
                sender_city: "",
                sender_cap: "",
                sender_state: "",
                sender_country_code: "",
                sender_email: "",
                sender_phone: "",
              },
            },
          },
          {
            moduleName: "recipient",
            moduleConfig: {
              editable: false,
              hidden: false,
              autocomplete: false,
              data: {
                rcpt_name: "Rossi Gino",
                rcpt_contact: "",
                rcpt_address: "via dei tigli 12",
                rcpt_city: "Milano",
                rcpt_cap: "12345",
                rcpt_state: "MI",
                rcpt_country_country: "IT",
                rcpt_email: "test@test.it",
                rcpt_phone: "123445679",
              },
            },
          },
          {
            moduleName: "shipment",
            moduleConfig: {
              packagesDetails: {
                label: "colli",
                fieldsLabel: [
                  "altezza",
                  "larghezza",
                  "lunghezza",
                  "peso",
                  "volume",
                ],
                fixedPackagesNumber: 1,
                enable: true,
              },
              insurance: {
                enable: true,
                label: "valore",
              },
              returnLabel: {
                enable: true,
                insurance: {
                  enable: true,
                  label: "valore",
                },
              },
              pickup: {
                dropoff: true,
                showServicePoints: true,
                pickup: false,
                pickupSameDayCheck: false,
              },
              selectCourier: {
                couriers: {
                  selectionMode: "manual|dynamic|automatic",
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
                            name: "Express",
                          },
                        ],
                        label: "servizio",
                      },
                    },
                  ],
                  label: "corriere",
                },
                returnCouriers: {
                  enable: true,
                  selectionMode: "manual",
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
                              name: "Express",
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
            moduleConfig: {
              label: "lbl_payment",
              provider: ["monetaweb"],
            },
          },
          {
            moduleName: "awbPrinting",
            moduleConfig: {
              label: "lbl_printing",
              directDownload: {
                enable: true,
                label: "lbl_download",
              },
              summary: true,
            },
          },
        ],
      },
    }; */
  }

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
    recipient: {},
    shipment: {},
    step: null,
    flow: "reso facile",
  };

  constructor() {}

  greeting() {
    console.log("hello");
  }

  setStatus(status: any, field: string) {
    this.status[field] = status;
  }

  getStatus(): any {
    return this.status;
  }

  incrementStep() {
    this.activeStep += 1;
    console.log(this.activeStep);
  }
  getActiveStep(): number {
    return this.activeStep;
  }
  change() {
    return this.activeStep;
  }
}
