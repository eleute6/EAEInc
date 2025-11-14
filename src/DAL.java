import java.sql.*;
import java.util.Scanner;

public class DAL {
    
    private Connection getMySQLConnection(String databaseName, String user, String password) {
        try {
            return DriverManager.getConnection("jdbc:mysql://localhost:3306/" + databaseName, user, password);
        } catch(SQLException exception) {
            System.out.println("Failed to connect to the database" + exception.getMessage());
            return null;
        }
    }

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

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        DAL dal = new DAL();

        String databaseName = "researchDB";

        System.out.print("Enter MySQL username: ");
        String user = scanner.nextLine();

        System.out.print("Enter MySQL password: ");
        String password = scanner.nextLine();   // visible on screen for now, consider hiding input at a later time


        // test query to print current timestamp to ensure connection works
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

