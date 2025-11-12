package app;
/* IMPORTS */
// SERVER LOGIC //
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

//JAVA IO TOOLS //
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.util.Collections;
import java.util.stream.Collectors;

// GSON TOOLS //
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

// GOOGLE OAUTH //
import com.google.api.client.auth.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

/* SERVER HOSTING
 * This class is used to run a server hosting an HTML page
 * and to handle the POST / GET message logic. Elements will
 * be commented as needed for understanding. References the
 * ServerTools class for methods that help run things.
 */
public class ServerHosting {
    // PRIVATE MEMBERS //
    private static final String DIR = System.getProperty("user.dir");
    private static final Gson gson = new Gson();
    private static final String CLIENT_ID = "727241440215-4r616p6l5ag90hglqrkft5m9b6gs2p4v.apps.googleusercontent.com";
    private static final String DATABASE_URI = "";

    // PAGE TO DIRECT TO : page.tsx
    // PAGE TO START WITH : tempsignin.html
    public static void main(String[] args) throws Exception {
        //STEP 1: Create Components
        HttpServer s = HttpServer.create(new InetSocketAddress(5500), 0);
        s.createContext("/", new StaticHandler());
        s.createContext("/auth/google", new AuthHandler());

        //STEP 2: Get Server Running
        s.setExecutor(null);
        s.start();
        System.out.println("SERVER RUNNING ON: PORT 5500");
        System.out.println("Serving files from: " + DIR);
    }

    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // STEP 1: Establish Pathing
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            // STEP 2: Send 404 if File Doesn't Exist
            File file = new File(DIR, path);

            //TESTING
            System.out.println("Requested path: " + path);
            System.out.println("Resolved file: " + file.getAbsolutePath());
            //

            if (!file.exists()) {
                exchange.sendResponseHeaders(404, -1);
                return;
            }

            // STEP 3: Check File Contents
            String mime = Files.probeContentType(file.toPath());
            exchange.getResponseHeaders().set("Content-Type", mime != null ? mime : "text/html");

            // STEP 4: Serve HTML File
            byte[] bytes = Files.readAllBytes(file.toPath());
            exchange.sendResponseHeaders(200, bytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(bytes);
            os.close();
        }
    }

    static class AuthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            // STEP 1: Check that Request is Post
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }

            // STEP 2: Read Message Information
            String body = new BufferedReader(new InputStreamReader(exchange.getRequestBody())).lines().collect(Collectors.joining("\n"));
            JsonObject requestJson = gson.fromJson(body, JsonObject.class);
            String idTokenString = requestJson.get("id_token").getAsString();
            JsonObject responseJson = new JsonObject();

            // STEP 3: Construct Token
            try {
                // STEP 3.1: Verify Token
                GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance()).setAudience(Collections.singletonList(CLIENT_ID)).build();

                GoogleIdToken idToken = verifier.verify(idTokenString);
                if (idToken != null) {
                    // STEP 3.2: Retrieve Token Information
                    GoogleIdToken.Payload payload = idToken.getPayload();

                    // STEP 3.3: Pull Out Token Information
                    String email = payload.getEmail();
                    String name = (String) payload.get("name");
                    String picture = (String) payload.get("picture");

                    // STEP 3.4: Update Database
                    updateUser(name, email, picture);

                    //STEP 3.5: Collect JSON Response Materials - WILL BE ENCRYPTED IN PRODUCTION
                    responseJson.addProperty("status", "valid");
                    responseJson.addProperty("name", name);
                    responseJson.addProperty("email", email);
                    responseJson.addProperty("picture", picture);

                    //STEP 4 : Redirect by HTTP to Other Page
                    exchange.getResponseHeaders().add("Location", "/user/page.tsx");
                    exchange.sendResponseHeaders(302, -1);
                    exchange.close();
                    return;
                } else { //If the user is invalid, will redirect to ERROR_PAGE
                    responseJson.addProperty("status", "invalid");
                }
            } catch (Exception e) { //Catches Errors
                e.printStackTrace();
                responseJson.addProperty("status", "error");
                responseJson.addProperty("message", e.getMessage());
            }

            // STEP 4: Send Response
            byte[] respBytes = gson.toJson(responseJson).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, respBytes.length);
            OutputStream os = exchange.getResponseBody();
            os.write(respBytes);
            os.close();
        }
    }

    private static void updateUser(String name, String email, String pictureLink) {
        //TO-DO : Database Linking
    }

}
