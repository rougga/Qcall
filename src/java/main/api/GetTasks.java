package main.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import main.controller.TaskController;
import main.modal.Task;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class GetTasks extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        JSONObject all = new JSONObject();
        JSONArray result = new JSONArray();
        String id_service = req.getParameter("id_service");
        ArrayList<Task> tasks = new ArrayList<>();
        tasks.add(new Task("IAM", id_service));
        tasks.add(new Task("Orange", id_service));
        tasks.add(new Task("INWI", id_service));
        if (StringUtils.isNotBlank(id_service)) {
            // ArrayList<Task> tasks = new TaskController().getTasksByService(id_service);
            try {
                PrintWriter out = resp.getWriter();
                resp.setContentType("application/json");
                resp.setCharacterEncoding("UTF-8");
                tasks.stream().map(task -> {
                    JSONObject taskO = new JSONObject();
                    taskO.put("name", task.getName());
                    taskO.put("id_task", task.getId().toString());
                    return taskO;
                }).forEachOrdered(taskO -> {
                    result.add(taskO);
                });
                all.put("result", result);
                out.print(all);
            } catch (IOException ex) {
                Logger.getLogger(GetInfo.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    }
}
