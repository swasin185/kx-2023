import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.sql.*;
import java.util.Calendar;
import java.util.Locale;
/**
 * Att2000 Finger Print Time Scanner Export Data
 */
public class AttExport {
	@SuppressWarnings("resource")
	public static void copy(File source, File dest) throws IOException {
		FileChannel in = null, out = null;
		try {
			in = new FileInputStream(source).getChannel();
			out = new FileOutputStream(dest).getChannel();
			long size = in.size();
			MappedByteBuffer buf = in.map(FileChannel.MapMode.READ_ONLY, 0, size);
			out.write(buf);
		} finally {
			if (in != null)
				in.close();
			if (out != null)
				out.close();
		}
	}

// AttExport.query01=select userinfo.BadgeNumber, CHECKINOUT.CHECKTIME AS 'DATETIME', null AS 'Date', null AS 'Time' from userinfo, checkinout where checktime between ? and ?+1 and userinfo.att=1 and userinfo.userid=checkinout.userid
// AttExport.query02=select BadgeNumber, name from userinfo where userinfo.att=1
// AttExport.create01=create table if not exists atttime (BadgeNumber varchar(6), DayOfYear smallint, CheckTime Time)
// AttExport.insert01=insert into ATTTIME ?;
// AttExport.insert02=insert into EMP ?;
// AttExport.update01=update ATTTIME set Date = SUBSTR(CheckTime,1,10), Time = SUBSTR(CheckTime,12,8);

	public static void main(String[] args) {
		try {
			// String mdb = "C:/Program Files/Att2008/ATT2000.MDB";
			String mdb = "/home/tom/ATT2000.MDB";
			if (args != null && args.length > 0)
				mdb = args[0];
			DriverManager.registerDriver(new net.ucanaccess.jdbc.UcanaccessDriver());
			Connection att2000 = DriverManager.getConnection("jdbc:ucanaccess://" + mdb);
			DriverManager.registerDriver(new org.mariadb.jdbc.Driver());
			Connection payroll = DriverManager.getConnection("jdbc:mysql://localhost:3306/payroll", "kxserv", "kxserv");

			PreparedStatement ptmt = att2000
					.prepareStatement("select userinfo.BadgeNumber, CHECKINOUT.CHECKTIME from userinfo, checkinout "
							+ "where checktime>=? and userinfo.att=1 and userinfo.userid=checkinout.userid");

			ResultSet rs = payroll.createStatement()
					.executeQuery("select max(dateTxt) from timecard where dateTxt <= curdate()");

			Calendar cal = Calendar.getInstance(Locale.UK);
			cal.add(Calendar.MONTH, -12);
			Date d = new Date(cal.getTimeInMillis());
			if (rs.next())
				if (rs.getDate(1) != null)
					d = rs.getDate(1);

			System.out.println("Export Date = " + d);

			ptmt.setDate(1, d);

			rs = ptmt.executeQuery();
			PreparedStatement payrollPtmt = payroll.prepareStatement("insert into timecard values (?,?,?)");
			payroll.createStatement().execute("start transaction");
			String x;
			int i = 1;
			int c = 0;
			while (rs.next()) {
				i++;
				payrollPtmt.setString(1, rs.getString(1));
				x = rs.getString(2);
				payrollPtmt.setString(2, x.substring(0, 10));
				payrollPtmt.setString(3, x.substring(11, 19));
				try {
					payrollPtmt.executeUpdate();
					c++;
				} catch (SQLException e) {
				}
				if (i % 10 == 0) {
					System.out.print(".");
					if (i % 1000 == 0)
						System.out.println("\t" + i);
				}
			}
			rs.close();
			ptmt.close();
			System.out.println();
			System.out.println("Time Export " + c + " records");

			payroll.createStatement().execute("commit");
			att2000.close();
			payroll.close();
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}

}
