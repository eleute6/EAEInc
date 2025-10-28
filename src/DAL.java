import java.sql.*;

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
            connection.close();
            return true;
        } catch (SQLException exception) {
            System.out.println("Failed to execute the query: " + exception.getMessage());
            return false;
        }
    }

}
