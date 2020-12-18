package main.modal;

import java.util.UUID;

public class Window {

    private String id;
    private int win_number;
    private String name;
    private int status;
    private String win_group_id;
    private String default_user;
    private String branch_id;
    private UUID db_id;
    private String screen_type;

    public Window(String id, int win_number, String name, int status, String win_group_id, String default_user, String branch_id, UUID db_id, String screen_type) {
        this.id = id;
        this.win_number = win_number;
        this.name = name;
        this.status = status;
        this.win_group_id = win_group_id;
        this.default_user = default_user;
        this.branch_id = branch_id;
        this.db_id = db_id;
        this.screen_type = screen_type;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setWin_number(int win_number) {
        this.win_number = win_number;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setWin_group_id(String win_group_id) {
        this.win_group_id = win_group_id;
    }

    public void setDefault_user(String default_user) {
        this.default_user = default_user;
    }

    public void setBranch_id(String branch_id) {
        this.branch_id = branch_id;
    }

    public void setDb_id(UUID db_id) {
        this.db_id = db_id;
    }

    public void setScreen_type(String screen_type) {
        this.screen_type = screen_type;
    }

    public String getId() {
        return id;
    }

    public int getWin_number() {
        return win_number;
    }

    public String getName() {
        return name;
    }

    public int getStatus() {
        return status;
    }

    public String getWin_group_id() {
        return win_group_id;
    }

    public String getDefault_user() {
        return default_user;
    }

    public String getBranch_id() {
        return branch_id;
    }

    public UUID getDb_id() {
        return db_id;
    }

    public String getScreen_type() {
        return screen_type;
    }
    
}
