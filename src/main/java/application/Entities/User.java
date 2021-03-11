package application.Entities;

import com.sun.istack.NotNull;

import javax.persistence.*;


/*
The user entity
 */
@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue
    private Long idUser;

    @NotNull
    @Column(nullable = false)
    private String firstName;
    @NotNull
    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    @NotNull
    private String lastName;
    @Column(nullable = false)
    @NotNull
    private String email;
    @Column(nullable = false)
    @NotNull
    private String password;

    //role it's used to decide where the user can navigate (which paths)
    @Column(nullable = false)
    private String role;

    public User() {
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
