package com.example.Socketchatapp.model;

import java.util.ArrayList;
import java.util.List;

public class Storage {
    public static List<ActiveUser> activeUserList=new ArrayList<>();

    public static void removeBySession(String session){
        for(int i=0;i<activeUserList.size();i++){
            if(activeUserList.get(i).getSession().equals(session)){
                activeUserList.remove(i);
                break;
            }
        }
    }

}
