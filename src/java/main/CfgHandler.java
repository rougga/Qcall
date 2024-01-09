package main;

public class CfgHandler {
    
    //MetaData
    public  static final String APP = "QcallPlus";
    public static final String VERSION = "0.4";
    public  static final String YEAR = "2023";
    public static final String COMPANY = "ROUGGA";
    public static final String CLIENT = "NST-Maroc";
    public static final int APP_PORT=8888;
    public static String APP_NODE="QcallPlus";
    
    //Pages
    
    public static String PAGE_ROOT = "/QcallPlus/";
    public static String PAGE_LOGIN = "/QcallPlus/index.jsp";
    public static String PAGE_HOME = "/QcallPlus/home.jsp";
    
    //database
    public static String DB_HOST = "localhost";
    public static String DB_PORT = "5432";
    public static String DB_DATABASE = "postgres";
    public static String DB_USER = "honyi";
    public static String DB_PASSWORD = "honyi123";
    
    public CfgHandler()  {
    }


}
