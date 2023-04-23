
import java.sql.*;

public class PayrollMigrate {
	public static Connection getDerbyConnect(String db) {
		System.out.println("connect derby " + db);
		try {
			DriverManager.registerDriver(new org.apache.derby.jdbc.EmbeddedDriver());
			return DriverManager.getConnection("jdbc:derby:/khgroup/payroll/" + db + ";create=false");
		} catch (SQLException e) {
			System.out.println(e.getMessage());
			return null;
		}
	}

	public static Connection getMariaDBConnect(String db) {
		System.out.println("connect mariadb " + db);
		try {
			DriverManager.registerDriver(new org.mariadb.jdbc.Driver());
			return DriverManager.getConnection("jdbc:mysql://localhost:3306/" + db, "kxadmin", "kxadmin");
		} catch (SQLException e) {
			System.out.println(e.getMessage());
			return null;
		}
	}

	private static void migrate(String srcDB, String dstDB, String comCode) throws SQLException {
		System.out.println("----------------------------------------------------------");
		Connection destConn = PayrollMigrate.getMariaDBConnect(dstDB);
		Connection sourceConn = PayrollMigrate.getDerbyConnect(srcDB);
		Statement destStmt = destConn.createStatement();
		Statement sourceStmt = sourceConn.createStatement();
		destStmt.execute("set foreign_key_checks = 0");
		ResultSet rs = sourceStmt.executeQuery("select * from COMPANY");
		if (rs.next())
			destStmt.executeUpdate("insert into company(comCode,comName,taxid,address,yr,mo) values ('" + comCode
					+ "','" + rs.getString("NAME") + "','" + rs.getString("TAXID") + "','" + rs.getString("ADDRESS")
					+ "'," + rs.getString("YR") + "," + rs.getString("MN") + ")");

		rs.close();

		PreparedStatement ptmt = destConn.prepareStatement(
				"insert into employee value(?,?,?,?,?,?,null,?,null,?, ?,?,?,null,null,?,?,?,?,?, ?,?,?)");
		rs = sourceStmt.executeQuery("select * from EMPLOYEE");
		System.out.print(">> employee\t");
		records = 0;
		while (rs.next())
			if (!"".equals(rs.getString("EMPCODE"))) {
				ptmt.setString(1, comCode);
				ptmt.setString(2, rs.getString("EMPCODE"));
				ptmt.setString(3, rs.getString("PERCODE"));
				ptmt.setString(4, rs.getString("PREFIX"));
				String fullName = rs.getString("NAME");
				ptmt.setString(5, fullName.substring(0, fullName.indexOf(' ')));
				ptmt.setString(6, fullName.substring(fullName.indexOf(' ') + 1));
				ptmt.setDate(7, rs.getDate("BIRTHDATE"));
				ptmt.setDate(8, rs.getDate("BEGINDATE"));
				ptmt.setDate(9, rs.getDate("ENDDATE"));
				ptmt.setString(10, rs.getString("EMPTYPE"));
				ptmt.setString(11, rs.getString("BANKACCOUNT"));
				ptmt.setInt(12, rs.getInt("CHILD") + rs.getInt("CHILDSTD"));
				ptmt.setInt(13, rs.getInt("CHILDSTD"));
				ptmt.setBoolean(14, "Y".equals(rs.getString("SPOUSE")));
				ptmt.setBoolean(15, "Y".equals(rs.getString("SHARE_CHILD")));
				ptmt.setBoolean(16, "Y".equals(rs.getString("EXCEPT_SOCIAL")));
				ptmt.setDouble(17, rs.getDouble("DEDUCT_INSURE"));
				ptmt.setDouble(18, rs.getDouble("DEDUCT_HOME"));
				ptmt.setDouble(19, rs.getDouble("DEDUCT_OTHER"));
				ptmt.execute();
				records++;
			}
		System.out.println(records + " records");
		ptmt.close();
		rs.close();
		
		ptmt = destConn.prepareStatement(
				"insert into salary value(?,?,?,?,?)");
		rs = sourceStmt.executeQuery("select * from PAYROLLSETUP");
		System.out.print(">> salary\t");
		records = 0;
		while (rs.next()) {
			ptmt.setString(1, comCode);
			ptmt.setString(2, rs.getString("EMPCODE"));
			ptmt.setString(3, rs.getString("INCCODE"));
			ptmt.setDouble(4, rs.getDouble("VALUE"));
			ptmt.setInt(5, rs.getInt("DURATION"));
			records++;
		}
		System.out.println(records + " records");
		ptmt.close();
		rs.close();
		
		ptmt = destConn.prepareStatement(
				"insert into payroll value(?,?,?,?,?,?)");
		rs = sourceStmt.executeQuery("select * from PAYROLL");
		System.out.print(">> payroll\t");
		records = 0;
		while (rs.next()) {
			ptmt.setInt(1, rs.getInt("YR"));
			ptmt.setInt(2, rs.getInt("MN"));
			ptmt.setString(3, comCode);
			ptmt.setString(4, rs.getString("EMPCODE"));
			ptmt.setString(5, rs.getString("INCCODE"));
			ptmt.setDouble(6, rs.getDouble("VALUE"));
			records++;
		}
		System.out.println(records + " records");
		ptmt.close();
		rs.close();
		
		destStmt.execute("set foreign_key_checks = 1");
		sourceConn.close();
		destConn.close();
	}

	private static void empty(String dstDB) throws SQLException {
		Connection destConn = PayrollMigrate.getMariaDBConnect(dstDB);
		Statement destStmt = destConn.createStatement();

		destStmt.execute("set foreign_key_checks = 0");
		destStmt.executeUpdate("truncate company");
		destStmt.executeUpdate("truncate employee");
		destStmt.executeUpdate("truncate salary");
		destStmt.executeUpdate("truncate payroll");
		destStmt.executeUpdate("truncate incometype");
		Connection sourceConn = PayrollMigrate.getDerbyConnect("kh");
		Statement sourceStmt = sourceConn.createStatement();
		ResultSet rs = sourceStmt.executeQuery("select * from INCOME");
		PreparedStatement ptmt = destConn.prepareStatement("insert into incometype value(?,?,?,?,?,?,?)");
		System.out.print(">> incometype\t");
		records = 0;
		while (rs.next()) {
			ptmt.setString(1, rs.getString("INCCODE"));
			ptmt.setString(2, rs.getString("NAME"));
			ptmt.setInt(3, "30".compareTo(rs.getString("INCCODE")) <= 0 ? -1 : 1);
			ptmt.setBoolean(4, "Y".equals(rs.getString("TAX")));
			ptmt.setBoolean(5, "Y".equals(rs.getString("CLEAR")));
			ptmt.setDouble(6, rs.getDouble("RATEMAX"));
			ptmt.setDouble(7, rs.getDouble("RATE"));
			ptmt.execute();
			records++;
		}
		System.out.println(records + " records");
		destStmt.execute("set foreign_key_checks = 1");
		sourceConn.close();
		destConn.close();
	}

	private static int records;

	public static void main(String[] args) {
		try {
			PayrollMigrate.empty("payroll");
			PayrollMigrate.migrate("kh", "payroll", "01");
			PayrollMigrate.migrate("swt", "payroll", "02");
			PayrollMigrate.migrate("ktd", "payroll", "03");
			PayrollMigrate.migrate("kbc", "payroll", "04");
			PayrollMigrate.migrate("kws", "payroll", "05");
			PayrollMigrate.migrate("kct", "payroll", "06");
			System.out.println("----------------------------------------------------------");
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}
}
