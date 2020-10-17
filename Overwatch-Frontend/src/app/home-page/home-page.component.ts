import { Component, OnInit } from '@angular/core';

// import { WebsocketService } from './Services/websocket.service';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

// import { Component, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {


  title = 'angularProject';

  response: any;
  temperatureData: any;
  battData: any;
  emiData: any;
  fuelData: any;
  speedData: any;
  susData2: any;
  susData: any;
  tireData2: any;
  tireData: any;
  constructor() {

  }
  ngOnInit() {
    this.onLogin();
  }



  myWebSocket = webSocket('wss://ms-iot-api.azurewebsites.net');

  onLogin() {
    console.log('hi');
    this.myWebSocket.subscribe(
      msg => {
        this.response = msg;

        this.temperatureData = this.response.IotData.engineHeat;
        this.tireData = this.response.IotData.tirePressure1;
        this.tireData2 = this.response.IotData.tirePressure2;
        this.susData = this.response.IotData.suspension1;
        this.susData2 = this.response.IotData.suspension2;
        this.speedData = this.response.IotData.speed;
        this.fuelData = this.response.IotData.fuelLevel;
        this.emiData = this.response.IotData.emission;
        this.battData = this.response.IotData.batteryLevel;
        console.log(this.response);
        //console.log(this.temperatureData);
        // this.chart.data.datasets[0].data = this.response.IotData.engineHeat;
         //console.log(this.chart.data.datasets[0].data)
        // this.chart.update();
      },

      err => console.log(err),
      // Called if WebSocket API signals some kind of error    
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)  

    );


  }
  connect() {
    console.log('clicked');
    window.open('http://overwatch-insights.herokuapp.com/', "_blank");
  }

  connect1() {
    console.log('clicked1');
    window.open('https://app.powerbi.com/Redirect?action=OpenApp&appId=adc2f9fa-03aa-4773-bf72-7a7bbea67d07&ctid=84c31ca0-ac3b-4eae-ad11-519d80233e6f', "_blank");

  }





}


