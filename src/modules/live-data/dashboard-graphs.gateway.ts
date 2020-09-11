import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage, 
    OnGatewayConnection, 
    OnGatewayDisconnect,
    OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway()
export class DashboardGraphsGateway implements OnGatewayInit ,OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    usersOnline: number = 0;
    totalUsers: number = 0;
    
    //Funcion que se ejecuta cada que se inicializa correctamente el soket
    afterInit() {
        //console.log('Gateway initialized');
    }

    async handleConnection(){
        // A client has connected
        this.usersOnline++;
        this.totalUsers++;
        // Notify connected clients of current users
        this.server.emit('usersOnline', this.usersOnline);
        //console.log("usuario conectado");
        this.server.emit('usersToday', this.totalUsers);
    }

    async handleDisconnect(){
        // A client has disconnected
        this.usersOnline--;

        // Notify connected clients of current users
        this.server.emit('usersOnline', this.usersOnline);

    }

    @SubscribeMessage('chat')
    async onChat(client, message){
        client.broadcast.emit('chat', message);
    }

}