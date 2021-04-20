package main.api;

import java.io.IOException;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ma.rougga.nst.controller.TaskController;
import main.PgConnection;
import org.apache.commons.lang3.StringUtils;

public class SetTaskToTicket extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id_ticket=req.getParameter("tid");
        String id_tasks=req.getParameter("id_task");
        String qte = req.getParameter("qte");
        if (StringUtils.isNoneBlank(id_ticket,id_tasks,qte)) {
            try {
                new TaskController(new PgConnection().getStatement()).setTaskToTicket(id_tasks, id_ticket,Integer.parseInt(qte));
            } catch (ClassNotFoundException | SQLException ex) {
                Logger.getLogger(SetTaskToTicket.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

}
