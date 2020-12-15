import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../service/server.service'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  username:string;
  room:string;


  constructor(private serverService:ServerService) { }

  ngOnInit(): void {
  }


 onSubmit(user, room){
   this.username=user;
   this.room=room;
  console.log(this.username, this.room);
  }
}
