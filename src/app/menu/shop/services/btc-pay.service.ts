import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

declare var btcpay: any;

@Injectable({
  providedIn: 'root'
})
export class BtcPayService {

  constructor(private httpClient: HttpClient) {

  }

  createInvoice(invoiceCreation: any): Promise<boolean> {
    return new Promise(resolve => {
      const request = this.httpClient.post('https://btcpay.dexxire.com/invoices', invoiceCreation, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic T2hyVU9QMVZRQ2RrYjdNSXBXTUk3R0RMSVZsN0RpTFcxUFA3aXBDcG5pTw=='
        })
      }).subscribe((res: any) => {
        btcpay.showInvoice(res.data.id);

        btcpay.onModalReceiveMessage((event) => {
          if (typeof (event.data) === 'object') {
            const data = event.data;

            if (data.status === "paid") {
              btcpay.hideFrame();
              request.unsubscribe();

              const invoiceSubscriber = this.getInvoice(res.data.id).subscribe((invoice: any) => {
                if (invoice.data.status === 'complete') {
                  resolve(res.data.id);
                } else {
                  resolve(false);
                }

                invoiceSubscriber.unsubscribe();
              });
            }
          } else if (event.data === "close") {
            request.unsubscribe();

            resolve(false);
          }
        })
      })
    })
  }

  getInvoice(invoiceId: string) {
    return this.httpClient.get(`https://btcpay.dexxire.com/invoices/${invoiceId}`, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic T2hyVU9QMVZRQ2RrYjdNSXBXTUk3R0RMSVZsN0RpTFcxUFA3aXBDcG5pTw==',
        'Access-Control-Allow-Origin': '*'
      })
    });
  }
}
