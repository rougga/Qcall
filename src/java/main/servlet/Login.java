package main.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.core5.net.URIBuilder;

public class Login extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            System.err.println("[QCall] Login.Servlet.doPost: Connecting...");

            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String branchId = StringUtils.isBlank(request.getParameter("branchId")) ? "1": request.getParameter("branchId") ;
            String windowText = request.getParameter("windowText");
            String rand = request.getParameter("rand");
            String window = request.getParameter("window");
            String host = request.getParameter("host");
            String port = request.getParameter("port");
            if (StringUtils.isNoneBlank(username, password, branchId, windowText, rand, window)) {
                URI uri = new URIBuilder()
                        .setScheme("http")
                        .setHost("localhost")
                        .setPort(8888)
                        .setPath("/server/client/login")
                        .setParameter("username", username)
                        .setParameter("password", password)
                        .setParameter("branchId", branchId)
                        .setParameter("windowText", windowText)
                        .setParameter("rand", rand)
                        .setParameter("window", window)
                        .build();
                HttpGet httpget = new HttpGet(uri);
                System.out.println(httpget.getUri().toString());
            } else {
                Logger.getLogger(Login.class.getName()).log(Level.SEVERE, "Some Login form data are empty", "");
            }
        } catch (URISyntaxException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
       
    }

}
