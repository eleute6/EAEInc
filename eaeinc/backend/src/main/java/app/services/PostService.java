package app.services;

import app.models.Post;
import app.models.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PostService {
    private static final String DATABASE_URI = "jdbc:mysql://localhost:3306/ResearchPageDB";
    private static final String DB_USER = "backend_user";
    private static final String DB_PASSWORD = "eaeincdb";

    // Create a post linked to a user
    public Post createPost(String text, String image, User user) throws SQLException {
        String sql = "INSERT INTO Posts (text, image, userFirstName, userLastName, userImageUrl) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(DATABASE_URI, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, text != null ? text : "");
            stmt.setString(2, image != null ? image : "");
            stmt.setString(3, user.firstName != null ? user.firstName : "");
            stmt.setString(4, user.lastName != null ? user.lastName : "");
            stmt.setString(5, user.imageUrl != null ? user.imageUrl : "");

            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating post failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int postId = generatedKeys.getInt(1);
                    return new Post(postId, text, image, user);
                } else {
                    throw new SQLException("Creating post failed, no ID obtained.");
                }
            }
        }
    }

    // Get all posts
    public List<Post> getAllPosts() throws SQLException {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT * FROM Posts";

        try (Connection conn = DriverManager.getConnection(DATABASE_URI, DB_USER, DB_PASSWORD);
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                // Make sure user fields are never null
                String firstName = rs.getString("userFirstName");
                String lastName = rs.getString("userLastName");
                String imageUrl = rs.getString("userImageUrl");

                User user = new User(
                        firstName != null ? firstName : "",
                        lastName != null ? lastName : "",
                        imageUrl != null ? imageUrl : ""
                );

                // Create post with text, image, and user
                String text = rs.getString("text") != null ? rs.getString("text") : "";
                String image = rs.getString("image") != null ? rs.getString("image") : "";

                Post post = new Post(text, image, user);
                posts.add(post);
            }
        }

        return posts;
    }

}
