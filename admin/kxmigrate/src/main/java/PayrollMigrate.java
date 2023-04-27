
import java.sql.*;
/**
 * Mirate DB from derby Java Application to kxpayroll
 */
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
		destStmt.execute("start transaction");
		ResultSet rs = sourceStmt.executeQuery("select * from COMPANY");
		if (rs.next()) {
			destStmt.executeUpdate("insert into company(comCode,comName,taxid,address,yr,mo) values ('" + comCode + "','"
					+ rs.getString("NAME") + "','" + rs.getString("TAXID") + "','" + rs.getString("ADDRESS") + "',"
					+ rs.getString("YR") + "," + rs.getString("MN") + ")" );
		}

		rs.close();

		PreparedStatement ptmt = destConn.prepareStatement(
				"insert into employee value(?,?,?,?,?,?,null,0,?,null,?, ?,?,?,null,null,?,?,?,?,?, ?,?,?,?)");
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
				ptmt.setString(5, fullName.substring(0, fullName.indexOf(' ')).trim());
				ptmt.setString(6, fullName.substring(fullName.indexOf(' ') + 1).trim());
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
				ptmt.setString(20, null);
				ptmt.execute();
				records++;
			}
		System.out.println(records + " records");
		ptmt.close();
		rs.close();
		
		ptmt = destConn.prepareStatement("insert into salary value(?,?,?,?,?)");
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

		ptmt = destConn.prepareStatement("insert into payroll value(?,?,?,?,?,?)");
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
		destStmt.execute("commit");
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
		destStmt.executeUpdate("truncate timetype");
		Connection sourceConn = PayrollMigrate.getDerbyConnect("kh");
		Statement sourceStmt = sourceConn.createStatement();
		ResultSet rs = sourceStmt.executeQuery("select * from INCOME");
		PreparedStatement ptmt = destConn.prepareStatement("insert into incometype value(?,?,?,?,?,?,?)");
		destStmt.execute("start transaction");
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
		
		destStmt.execute("commit");
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
			records =  0;
			Connection destConn = PayrollMigrate.getMariaDBConnect("payroll");
			PreparedStatement ptmt = destConn.prepareStatement("update employee set scanCode=? where comCode=? and empCode=?");
			Statement destStmt = destConn.createStatement();
			destStmt.execute("start transaction");
			System.out.print("update scanCode ");
			for (String[] x : PayrollMigrate.scanCode) {
				ptmt.setString(1, x[2]);
				ptmt.setString(2, x[0]);
				ptmt.setInt(3, Integer.parseInt(x[1]));
				ptmt.execute();
				records++;
			}
			destStmt.execute("commit");
			ptmt.close();
			destConn.close();
			System.out.println(records + " records");
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	public static String[][] scanCode = new String[][] { { "01", "21", "10006" }, { "01", "22", "10017" },
			{ "01", "24", "10122" }, { "01", "25", "10024" }, { "01", "26", "10018" }, { "01", "27", "10003" },
			{ "01", "30", "10033" }, { "01", "32", "10271" }, { "01", "33", "10436" }, { "01", "34", "10015" },
			{ "01", "38", "10348" }, { "01", "40", "10438" }, { "01", "41", "10169" }, { "01", "42", "10437" },
			{ "01", "45", "10610" }, { "01", "46", "10087" }, { "01", "48", "10224" }, { "01", "49", "10461" },
			{ "01", "52", "10580" }, { "01", "53", "10257" }, { "01", "54", "10458" }, { "01", "55", "10554" },
			{ "01", "56", "10542" }, { "01", "57", "10028" }, { "01", "58", "10001" }, { "01", "59", "10002" },
			{ "01", "61", "10004" }, { "01", "63", "10481" }, { "01", "64", "10156" }, { "01", "69", "10288" },
			{ "01", "73", "10582" }, { "01", "80", "10606" }, { "01", "82", "10317" }, { "01", "83", "10494" },
			{ "01", "84", "10607" }, { "01", "87", "10506" }, { "01", "91", "10339" }, { "01", "92", "10342" },
			{ "01", "96", "10357" }, { "01", "97", "10359" }, { "01", "100", "10264" }, { "01", "114", "10534" },
			{ "01", "116", "10528" }, { "01", "118", "10500" }, { "01", "119", "10309" }, { "01", "120", "10429" },
			{ "01", "121", "10469" }, { "01", "122", "10687" }, { "01", "123", "10690" }, { "01", "124", "10692" },
			{ "01", "125", "10700" }, { "02", "4", "41010" }, { "02", "5", "41012" }, { "02", "6", "41087" },
			{ "02", "8", "41002" }, { "02", "10", "40006" }, { "02", "11", "41093" }, { "02", "14", "40005" },
			{ "02", "15", "41006" }, { "02", "17", "40027" }, { "02", "19", "40010" }, { "02", "20", "40002" },
			{ "02", "21", "40016" }, { "02", "22", "41102" }, { "02", "23", "41094" }, { "02", "24", "40007" },
			{ "02", "25", "41015" }, { "02", "26", "41042" }, { "02", "27", "41095" }, { "02", "28", "41081" },
			{ "02", "30", "41014" }, { "02", "31", "41103" }, { "02", "32", "41104" }, { "02", "33", "41086" },
			{ "02", "34", "41085" }, { "02", "36", "41107" }, { "02", "38", "40025" }, { "02", "39", "41109" },
			{ "02", "40", "41119" }, { "02", "41", "41116" }, { "02", "45", "41121" }, { "02", "46", "41123" },
			{ "02", "47", "41122" }, { "02", "49", "41057" }, { "02", "50", "41073" }, { "02", "52", "41072" },
			{ "02", "55", "50025" }, { "02", "56", "50001" }, { "02", "57", "41130" }, { "02", "58", "41131" },
			{ "02", "59", "41135" }, { "02", "60", "41139" }, { "03", "4", "10179" }, { "03", "6", "10103" },
			{ "03", "8", "10014" }, { "03", "11", "10005" }, { "03", "13", "10282" }, { "03", "14", "10115" },
			{ "03", "15", "10011" }, { "03", "18", "10577" }, { "03", "19", "10439" }, { "03", "20", "10012" },
			{ "03", "23", "10545" }, { "03", "24", "10457" }, { "03", "25", "10462" }, { "03", "28", "10547" },
			{ "03", "35", "10598" }, { "03", "36", "10615" }, { "03", "38", "10633" }, { "03", "40", "10648" },
			{ "03", "41", "10650" }, { "03", "42", "10653" }, { "03", "43", "10438" }, { "03", "44", "10528" },
			{ "03", "45", "10357" }, { "03", "46", "10339" }, { "03", "47", "10087" }, { "03", "48", "10651" },
			{ "03", "49", "10654" }, { "03", "50", "10658" }, { "03", "51", "10661" }, { "03", "52", "10663" },
			{ "03", "54", "10666" }, { "03", "55", "10674" }, { "03", "56", "10681" }, { "04", "4", "41073" },
			{ "04", "9", "10606" }, { "04", "10", "10625" }, { "04", "11", "10627" }, { "04", "12", "10629" },
			{ "04", "13", "10631" }, { "04", "14", "10636" }, { "04", "15", "10637" }, { "04", "16", "10656" },
			{ "04", "17", "10655" }, { "04", "18", "10662" }, { "04", "19", "10673" }, { "04", "20", "10675" },
			{ "04", "21", "10676" }, { "04", "22", "10688" }, { "04", "23", "10691" }, { "05", "4", "10043" },
			{ "05", "5", "10024" }, { "05", "7", "10053" }, { "05", "9", "10121" }, { "05", "10", "10469" },
			{ "05", "11", "10120" }, { "05", "12", "10076" }, { "05", "13", "10087" }, { "05", "14", "10072" },
			{ "05", "15", "10088" }, { "05", "22", "10111" }, { "05", "23", "10223" }, { "05", "24", "10081" },
			{ "05", "26", "10082" }, { "05", "28", "10077" }, { "05", "31", "10045" }, { "05", "33", "10071" },
			{ "05", "34", "10031" }, { "05", "76", "10329" }, { "05", "80", "20001" }, { "05", "93", "30025" },
			{ "05", "108", "10412" }, { "05", "112", "10417" }, { "05", "118", "10682" }, { "05", "118", "10445" },
			{ "05", "119", "10556" }, { "05", "129", "10707" }, { "05", "129", "10574" }, { "06", "4", "10084" },
			{ "06", "6", "10140" }, { "06", "7", "10210" }, { "06", "8", "10489" }, { "06", "10", "10098" },
			{ "06", "11", "10097" }, { "06", "12", "10083" }, { "06", "14", "10102" }, { "06", "15", "10477" },
			{ "06", "16", "10544" }, { "06", "17", "10113" }, { "06", "19", "10108" }, { "06", "21", "10107" },
			{ "06", "22", "10101" }, { "06", "32", "10117" }, { "06", "36", "10275" }, { "06", "39", "10269" },
			{ "06", "44", "10414" }, { "06", "58", "10343" }, { "06", "59", "10413" } };
}
