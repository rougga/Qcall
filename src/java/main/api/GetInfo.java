package main.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import main.PgConnection;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;

public class GetInfo extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        JSONObject all = new JSONObject();
        String id_user = req.getParameter("id_user");
        String id_ticket = req.getParameter("id_ticket");
        long dealCount = 0;
        if (StringUtils.isNoneBlank(id_user, id_ticket)) {
            try {
                PgConnection con = new PgConnection();
                String SQL = "SELECT count(*) as dealCount FROM t_ticket "
                        + "WHERE status=4 and deal_user=? and "
                        + " to_date(to_char(ticket_time,'YYYY-MM-DD'),'YYYY-MM-DD')  >= TO_DATE(?,'YYYY-MM-DD') ";
                PreparedStatement ps = con.getStatement().getConnection().prepareStatement(SQL);
                ps.setString(1, id_user);
                ps.setString(2, new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
                ResultSet r = ps.executeQuery();
                if (r.next()) {
                    dealCount = r.getLong("dealCount");
                }
                all.put("dealCount", dealCount);
                System.err.println("DealCount:"+dealCount);
            } catch (Exception e) {
                all.put("error", e.getMessage());
            }
        }else{
            all.put("error", "Empty field in ajax params");
        }

        all.put("id_user", id_user);
        all.put("id_ticket", id_ticket);
        try {
            PrintWriter out = resp.getWriter();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            out.print(all);
        } catch (IOException ex) {
            Logger.getLogger(GetInfo.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
