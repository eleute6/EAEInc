package app.models;

public class User {
    public String firstName;
    public String lastName;
    public String imageUrl;

    public User(String firstName, String lastName, String imageUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageUrl = imageUrl;
    }

    public User() {}
}