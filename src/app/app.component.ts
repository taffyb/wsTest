import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { WsService } from './ws.service';
export const WS_ENDPOINT = "wss://fgpr357v49.execute-api.eu-west-2.amazonaws.com/dev";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message:string = 'Hello World';
  sendCounter:number=0;
  response$: Subject<string> = new Subject<string>();
  
  connected:boolean=false;
  connected$: Subject<boolean> = new Subject<boolean>();

  constructor(private wsSvc:WsService){
    wsSvc.on("echo",this.response$);
  }
  wsConnect(){  
    this.wsSvc.connect();
  }
  wsDisconnect(){    
    this.wsSvc.disconnect();
  }
  send(){    
    this.sendCounter+=1;
    this.wsSvc.send("echo",this.message+this.sendCounter);
  }


}
