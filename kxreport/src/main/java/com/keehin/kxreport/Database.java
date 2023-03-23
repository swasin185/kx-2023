package com.keehin.kxreport;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Locale;
import javax.sql.DataSource;
import org.mariadb.jdbc.MariaDbPoolDataSource;

public class Database {
    public static final String APP_PATH = "webapps/kxreport/";
    public static final String OUTPUT_PATH = APP_PATH + "output/";
    public static final String REPORT_PATH = "/khgroup/report";
    public static final String JDBC_URI = "jdbc:mariadb://127.0.0.1:3306/";
    public static final String USER = "kxreport";
    public static final String PWD = "kxreport";
    /*
     * create user 'kxreport'@'%' identified by 'kxreport'; grant select,execute on
     * *.* to 'kxreport'@'%';
     */

    public static final SimpleDateFormat DTFormat = new SimpleDateFormat("dd/MM/yy [HH:mm:ss]", Locale.US);

    // private HashMap<String, Connection> connectMap = new HashMap<String,
    // Connection>();
    private HashMap<String, DataSource> pools = new HashMap<String, DataSource>();

    public Database() throws SQLException {
        DriverManager.registerDriver(new org.mariadb.jdbc.Driver());
    }

    public Connection getConnection(String db) {
        Connection conn = null;
        if (db == null)
            db = "test";

        // String key = db + sessID;
        // if (connectMap.get(key) == null) {
        // try {
        // connectMap.put(key, DriverManager.getConnection(JDBC_URI + db, USER, PWD));
        // System.out.println("create connection : " + key);
        // } catch (SQLException e) {
        // e.printStackTrace();
        // }
        // }
        // conn = connectMap.get(key);

        if (pools.get(db) == null)
            pools.put(db, new MariaDbPoolDataSource(JDBC_URI + db + "?user=" + USER + "&password=" + PWD
                    + "&staticGlobal&minPoolSize=0&maxPoolSize=32&maxIdleTime=900&registerJmxPool=false"));
        try {
            conn = pools.get(db).getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }

}