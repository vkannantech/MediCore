package medicore.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL      = "jdbc:mysql://localhost:3306/medicore";
    private static final String USER     = "root";
    private static final String PASSWORD = "admin"; // ← change to your MySQL password

    private static Connection connection = null;

    public static Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
            }
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found! Add mysql-connector-j.jar to lib/");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Database connection failed! Check credentials in DBConnection.java");
            e.printStackTrace();
        }
        return connection;
    }
}
