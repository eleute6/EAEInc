package app.handlers;

import app.services.PostService;
import app.models.Post;
import app.models.User;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class PostHandler implements HttpHandler {

    private final PostService postService;
    private final Gson gson = new Gson();

    public PostHandler(PostService postService) {
        this.postService = postService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        System.out.println("Request method: " + exchange.getRequestMethod());

        // Add CORS headers
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        // Handle preflight OPTIONS request
        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        try {
            String method = exchange.getRequestMethod().toUpperCase();

            switch (method) {
                case "GET":
                    handleGet(exchange);
                    break;

                case "POST":
                    handlePost(exchange);
                    break;

                default:
                    exchange.sendResponseHeaders(405, -1); // Method Not Allowed
                    exchange.close();
                    break;
            }

        } catch (Exception e) {
            e.printStackTrace();
            sendError(exchange, "Internal Server Error", 500);
        }
    }

    private void handleGet(HttpExchange exchange) throws IOException {
        try {
            List<Post> posts = postService.getAllPosts();
            if (posts == null) posts = new ArrayList<>();
            String jsonResponse = gson.toJson(posts);

            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
            exchange.getResponseBody().write(jsonResponse.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
            sendError(exchange, "Failed to fetch posts", 500);
        } finally {
            exchange.close();
        }
    }

    private void handlePost(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("Incoming POST body: " + body);

            // Parse incoming JSON into Post
            Post incoming = gson.fromJson(body, Post.class);

            // Ensure post text and user object are non-null
            if (incoming.text == null) incoming.text = "";
            if (incoming.user == null) incoming.user = new User("", "", ""); // default empty user

            // Ensure fields in user are non-null
            if (incoming.user.emailID == null) incoming.user.emailID = "";
            if (incoming.user.userName == null) incoming.user.userName = "";
            if (incoming.user.pictureUrl == null) incoming.user.pictureUrl = "";

            // Create the post using PostService
            Post created = postService.createPost(
                    incoming.text,
                    incoming.image,
                    incoming.user
            );

            String jsonResponse = gson.toJson(created);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
            exchange.getResponseBody().write(jsonResponse.getBytes());

        } catch (Exception e) {
            e.printStackTrace();
            sendError(exchange, "Failed to create post", 500);
        } finally {
            exchange.close();
        }
    }

    private void sendError(HttpExchange exchange, String message, int statusCode) throws IOException {
        String errorJson = gson.toJson(new ErrorResponse(message));
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, errorJson.getBytes().length);
        exchange.getResponseBody().write(errorJson.getBytes());
    }

    // Simple error response class
    static class ErrorResponse {
        public String error;
        public ErrorResponse(String message) {
            this.error = message;
        }
    }
}
