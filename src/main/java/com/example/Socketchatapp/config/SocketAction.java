package com.example.Socketchatapp.config;

import com.example.Socketchatapp.model.ChatMessage;
import com.example.Socketchatapp.model.ChatType;
import com.example.Socketchatapp.model.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
@Component
public class SocketAction {
    @Autowired
   private SimpMessageSendingOperations messageTemplate;
   @EventListener
    public void handelWebSocketConnectListener(SessionConnectedEvent event){
        System.out.println("I'm a connected");
   }
    @EventListener
   public void handelWebSocketDisconnectListener(SessionDisconnectEvent event){
       StompHeaderAccessor headerAccessor= StompHeaderAccessor.wrap(event.getMessage());
       String username= (String) headerAccessor.getSessionAttributes().get("username");
       if(username!=null){
           System.out.println("I'm a not connected");
           ChatMessage chatMessage=new ChatMessage();
           chatMessage.setChatType(ChatType.LEAVE);
           chatMessage.setSender(username);
           Storage.removeBySession(headerAccessor.getSessionId());
           messageTemplate.convertAndSend("/topic/all",chatMessage);
       }
   }
}
