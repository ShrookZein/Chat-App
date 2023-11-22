package com.example.Socketchatapp.controller;

import com.example.Socketchatapp.model.ActiveUser;
import com.example.Socketchatapp.model.ChatMessage;
import com.example.Socketchatapp.model.Storage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/chat.logIn")
    @SendTo("/topic/all")
    public ChatMessage logIn(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("username",chatMessage.getSender());
        Storage.activeUserList.add(new ActiveUser(chatMessage.getSender(),headerAccessor.getSessionId()));
        return chatMessage;
    }
    @MessageMapping("/chat.send")
    @SendTo("/topic/all")
    public ChatMessage send(@Payload ChatMessage chatMessage){
        return chatMessage;
    }
}
