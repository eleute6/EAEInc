package app.models;

public class User {
    public String emailID;
    public String userName;
    public String pictureUrl;

    public User(String emailID, String userName, String pictureUrl) {
        this.emailID = emailID;
        this.userName = userName;
        this.pictureUrl = pictureUrl;
    }

    public User() {}
}