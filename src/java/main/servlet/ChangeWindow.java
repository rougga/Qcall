package main.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
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

public class ChangeWindow extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        JSONObject window = new JSONObject();
        String windowId = request.getParameter("windowId");
        System.err.println("windowId = " + windowId);
        if (StringUtils.isNotBlank(windowId)) {
            try {
                PrintWriter out = response.getWriter();
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");

                PgConnection con = new PgConnection();
                Window w = new WindowController(con.getStatement()).getById(windowId);
                if (w != null) {
                     request.getSession().setAttribute("SEAT_WINSTR", w.getName());
                     request.getSession().setAttribute("window", w.getId());
                    window.put("id", w.getId());
                    window.put("name", w.getName());
                    window.put("win_number", w.getWin_number());
                    window.put("status", w.getStatus());

                } else {
                    Logger.getLogger(ChangeWindow.class.getName()).log(Level.SEVERE, "[QCall] Class.ChangeWindow: no Window found with passed Id", "");
                }
                out.print(window);
                con.closeConnection();
            } catch (ClassNotFoundException | SQLException ex) {
                window.put("error", ex.getMessage());
            }
        } else {
            Logger.getLogger(ChangeWindow.class.getName()).log(Level.SEVERE, "[QCall] Class.ChangeWindow: windowId value is empty", "");
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
