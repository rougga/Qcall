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
import ma.rougga.nst.controller.main.ServiceController;
import ma.rougga.nst.controller.main.WindowController;
import ma.rougga.nst.modal.main.Service;
import ma.rougga.nst.modal.main.Window;
import main.PgConnection;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class GetServicesByWindowId extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        JSONObject all = new JSONObject();
        JSONArray result = new JSONArray();
        try {
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String windowId = req.getParameter("windowId");
            PgConnection con = new PgConnection();
            
            if (StringUtils.isBlank(windowId)) {
                Logger.getLogger(GetServicesByWindowId.class.getName()).log(Level.SEVERE, "ArrayList<Window> windows is empty  because passed param serverId is blank ", "");
                 all.put("error", "ArrayList<Window> windows is empty  because passed param serverId is blank ");
            } else {
                ArrayList<Service> services = new ServiceController(con.getStatement()).getServicesByWindowId(windowId);
                for (int i = 0; i < services.size(); i++) {
                    JSONObject service = new JSONObject();
                    service.put("id", services.get(i).getId());
                    service.put("name", services.get(i).getName());
                    service.put("status", services.get(i).getStatus());
                    result.add(service);
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
