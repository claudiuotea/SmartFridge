package application.DTOObjects;


import java.util.concurrent.atomic.LongAdder;

//used to send data back to the client after login
public class JwtResponse {
    private String jwt;
    private Long idUser;
    private String role;


    public JwtResponse(String jwt, Long username, String role) {

        this.jwt = jwt;
        this.idUser = username;
        this.role = role;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }
}
