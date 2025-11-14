import java.sql.*;
import java.util.Scanner;
import java.io.Console;

public class DAL {
    

    // Establishes a connection to the MySQL database
    private Connection getMySQLConnection(String databaseName, String user, String password) {
        try {
            return DriverManager.getConnection("jdbc:mysql://localhost:3306/" + databaseName, user, password);
        } catch(SQLException exception) {
            System.out.println("Failed to connect to the database" + exception.getMessage());
            return null;
        }
    }
    // Executes an SQL query 
    // Prints results to console
    // Takes in database name (researchDB), query, user, password
    // returns true if successful, false otherwise
    public boolean TryExecutingAQuery (String databaseName, String query, String user, String password) {
        try {
            Connection connection = getMySQLConnection(databaseName, user, password);
            if (connection == null) {
                System.out.println("Failed to get a connection, cannot execte query.");
                return false;
            }
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery(query);
            while (rs.next()) {
                System.out.println("Query Result: " + rs.getString(1));
            }

            rs.close();
            statement.close();
            connection.close();
            return true;

        } catch (SQLException exception) {
            System.out.println("Failed to execute the query: " + exception.getMessage());
            return false;
        }
    }
    // Main method to test DAL functionality
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        DAL dal = new DAL();
        Console console = System.console();

        if (console == null) {
            System.out.println("No console available");
        }

        String databaseName = "researchDB";

        System.out.print("Enter MySQL username: ");
        String user = scanner.nextLine();

        String password;

        if (console != null) {
            char[] passwordChars = console.readPassword("Enter MySQL password: ");
            password = new String(passwordChars);
        } else {
            // Fallback if console is not available
            System.out.print("Enter MySQL password (visible): ");
            java.util.Scanner sc = new java.util.Scanner(System.in);
            password = sc.nextLine();
            sc.close();
        }


        // Test query to print current timestamp to ensure connection works
        String query = "SELECT NOW()";

        boolean success = dal.TryExecutingAQuery(databaseName, query, user, password);
        if (success) {
            System.out.println("Connection successful!");
        } else {
            System.out.println("Connection failed.");
        }

        scanner.close();
    }
}

