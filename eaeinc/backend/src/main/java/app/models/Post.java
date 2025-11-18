package app.models;

public class Post {
    public int id;       // NEW
    public String text;
    public String image;
    public User user;

    // Constructor with id
    public Post(int id, String text, String image, User user) {
        this.id = id;
        this.text = text;
        this.image = image;
        this.user = user;
    }

    // Constructor without id (for creating new posts)
    public Post(String text, String image, User user) {
        this.text = text;
        this.image = image;
        this.user = user;
    }

    // Default constructor for Gson
    public Post() {}
}
