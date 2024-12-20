package electronics.elecstore.dto;

public class AuthResponse {
    private String token;
    private String username;
    private Integer status;
    private Integer id;

    public AuthResponse(String token, String username, Integer status, Integer id) {
        this.token = token;
        this.username = username;
        this.status = status;
        this.id = id ;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

	public Integer getId() {
		return id;
	}
    
    
}
