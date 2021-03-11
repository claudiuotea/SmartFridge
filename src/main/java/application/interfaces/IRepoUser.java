package application.interfaces;

import application.Entities.User;


public interface IRepoUser {
    /*
    Receive an user and save it to database
    Throws ServerException if the username or email already exists in the database
     */
    long saveUser(User user);

    /*
    finds an user by username and returns it if it exists,null otherwise
     */
    User findByUsername(String username);
    /*
    finds an user by username and returns it if it exists,null otherwise
     */
    User findByEmail(String email);

}
