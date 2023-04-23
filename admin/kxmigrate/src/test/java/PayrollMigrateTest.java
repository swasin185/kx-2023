import java.sql.*;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class PayrollMigrateTest extends TestCase {

	public PayrollMigrateTest(String testName) {
		super(testName);
	}

	public static Test suite() {
		return new TestSuite(PayrollMigrateTest.class);
	}
	
	private void testDerby(String db) {
		Connection con = PayrollMigrate.getDerbyConnect(db);
		assertNotNull(con);
		int cnt = -1;
		try {
			Statement stmt = con.createStatement();
			ResultSet rs = stmt.executeQuery("select count(*) from employee");
			if (rs.next())
				cnt = rs.getInt(1);
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		assertTrue(cnt >= 0);
	}

	public void testDerbyKH() {
		this.testDerby("kh");
	}
	
	public void testDerbySWT() {
		this.testDerby("swt");
	}
	
	public void testDerbyKWS() {
		this.testDerby("kws");
	}

	public void testDerbyKCT() {
		this.testDerby("kct");
	}

	public void testDerbyKTD() {
		this.testDerby("ktd");
	}
	
	public void testDerbyKBC() {
		this.testDerby("kbc");
	}

	public void testMariaDBPayroll() {
		Connection con = PayrollMigrate.getMariaDBConnect("payroll");
		assertNotNull(con);
		int cnt = -1;
		try {
			cnt = con.createStatement().executeUpdate("create temporary table x (id smallint, value decimal(9,2))");
			PreparedStatement  stmt = con.prepareStatement("insert into x value (?, ?)");
			stmt.setInt(1, 1);
			stmt.setDouble(2, 1020.69);
			cnt = stmt.executeUpdate();
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		assertTrue(cnt == 1);
	}
}
