package main.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ChangeStatus extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            String status = request.getParameter("status");
            String username = request.getParameter("username");
            String windowText = request.getParameter("windowText");
            String branchId = request.getParameter("branchId");
            String auto_call = "0";

            request.getSession().setAttribute("status", status);
            request.getSession().setAttribute("userName", username);
            request.getSession().setAttribute("SEAT_WINSTR", windowText);
            request.getSession().setAttribute("auto_deal", 0);
            request.getSession().setAttribute("auto_call_time", 10);
            request.getSession().setAttribute("call_wait_time", 10);
            request.getSession().setAttribute("userId", username);
            request.getSession().setAttribute("branchId", branchId);
            request.getSession().setAttribute("auto_call", auto_call);

            System.err.println(status);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

}
