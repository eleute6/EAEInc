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
        
        String emailID = user.emailID;
        String title = text != null ? text : "";
        String body = text != null ? text : ""; 
        String imageUrl = text != null ? text : "";
        String searchTag = "general"; // default tag
        
        
        String callSql = "{CALL CreateForumPost(?, ?, ?, ?, ?)}";

        try (Connection conn = DriverManager.getConnection(DATABASE_URI, DB_USER, DB_PASSWORD);
            CallableStatement stmt = conn.prepareCall(callSql)) {

            stmt.setString(1, emailID);
            stmt.setString(2, title);
            stmt.setString(3, body);
            stmt.setString(4, imageUrl);
            stmt.setString(5, searchTag);
            

            boolean hasResult = stmt.execute();

            int postId = -1;
            if (hasResult) {
                try (ResultSet rs = stmt.getResultSet()) {
                    if (rs.next()) {
                        postId = rs.getInt("forumID");
                    }
                }
            }

            return new Post(postId, text, image, user);
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
                String emailID = rs.getString("emailID");
                String userName = rs.getString("userName");
                String pictureUrl = rs.getString("pictureUrl");

                User user = new User(
                        emailID != null ? emailID : "",
                        userName != null ? userName : "",
                        pictureUrl != null ? pictureUrl : ""
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
