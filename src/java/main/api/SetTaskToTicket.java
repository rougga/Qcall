package main.api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import main.controller.TaskController;
import org.apache.commons.lang3.StringUtils;

public class SetTaskToTicket extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id_ticket=req.getParameter("bizId");
        String[] id_tasks=req.getParameterValues("id_tasks");
        if (StringUtils.isNotBlank(id_ticket) && id_tasks.length>0) {
            new TaskController().setTaskToTicket(id_tasks, id_ticket);
        }
    }

}
