import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
const WS_ENDPOINT = "wss://fgpr357v49.execute-api.eu-west-2.amazonaws.com/dev";

interface BodyData{
  action:string,
  data:any
}

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private socket:WebSocket;
  private observers:any={};

  constructor() {
    if(!this.socket){
      this.connect();
    }
  }
  on(action:string,observer:Subject<any>){
    this.observers[action]=observer;
  }
  send(action:string,data:any){
    const bodyData:BodyData={
      action:action,
      data:data
    }
    this.socket.send(JSON.stringify(bodyData));
    console.log(`Send ${JSON.stringify(bodyData,null,2)}`);
    
  }
  connect(){

    const observers=this.observers;

    if(!this.socket){
      this.socket = new WebSocket(WS_ENDPOINT); 
    }
    
    this.socket.onopen = function(e) {
      console.log(`[open] Connection established`);
    };
    this.socket.onmessage = function(event) {
      console.log(`[message] Data received from server: ${event.data}`);
      let bodyData:BodyData = JSON.parse(event.data);
      observers[bodyData.action].next(bodyData.data);
    };
    this.socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log(`[close] Connection died\n${JSON.stringify(event)}`);
      }
    };
    this.socket.onerror = function(error:ErrorEvent) {
      console.log(`[error] ${error.message}`);
    };
  }
  disconnect(){
    this.socket.close();
    this.socket = null;
  }
}
