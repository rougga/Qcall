

package main.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import main.PgConnection;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class GetAllWindows extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
        JSONObject all = new JSONObject();
        JSONArray result = new JSONArray();
        try{
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            PgConnection con = new PgConnection();
            ResultSet r = con.getStatement().executeQuery("select id,name,win_number,status from t_window;");
            while(r.next()){
                JSONObject window = new JSONObject();
                window.put("id", r.getString("id"));
                window.put("name", r.getString("name"));
                window.put("win_number", r.getInt("win_number"));
                window.put("status",  r.getInt("status"));
                result.add(window);
                
            }
            all.put("result", result);
            out.print(all);
            con.closeConnection();
        } catch (ClassNotFoundException | SQLException ex) {
            all.put("error", ex.getMessage());
        }
        
        
    }
    
    
    
    
}
