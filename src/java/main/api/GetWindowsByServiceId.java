package main.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ma.rougga.nst.controller.main.WindowController;
import ma.rougga.nst.modal.main.Window;
import main.PgConnection;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class GetWindowsByServiceId extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        JSONObject all = new JSONObject();
        JSONArray result = new JSONArray();
        try {
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String seviceId = req.getParameter("serviceId");
            PgConnection con = new PgConnection();
            
            if (StringUtils.isBlank(seviceId)) {
                Logger.getLogger(GetWindowsByServiceId.class.getName()).log(Level.SEVERE, "ArrayList<Window> windows is empty  because passed param serverId is blank ", "");
            } else {
                ArrayList<Window> windows = new WindowController(con.getStatement()).getWindowsByServiceId(seviceId);
                for (int i = 0; i < windows.size(); i++) {
                    JSONObject window = new JSONObject();
                    window.put("id", windows.get(i).getId());
                    window.put("name", windows.get(i).getName());
                    window.put("win_number", windows.get(i).getWin_number());
                    window.put("status", windows.get(i).getStatus());
                    result.add(window);
                }
            }
            all.put("result", result);
            out.print(all);
            con.closeConnection();
        } catch (ClassNotFoundException | SQLException ex) {
            all.put("error", ex.getMessage());
        }

    }

}
