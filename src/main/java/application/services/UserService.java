package application.services;

import application.DTOObjects.UserRegisterDTO;
import application.Entities.User;
import application.Entities.UserDetailsImpl;
import application.interfaces.IUserService;
import application.repositories.RepoUser;
import application.utils.ServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


/*
This will implement our interface of UserService
 */
@Service
public class UserService implements IUserService {
    @Autowired
    private RepoUser repoUser;
    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    /*
    That will be used to register a user
     */
    @Override
    public long save(UserRegisterDTO user) throws ServerException {
        User u = new User();
        //get info from the model and save the user in the database
        u.setPassword(passwordEncoder.encode(user.getPassword()));
        u.setUsername(user.getUsername());
        u.setEmail(user.getEmail());
        u.setFirstName(user.getFirstName());
        u.setLastName(user.getLastName());
        //any user that will register will have the USER role
        u.setRole("USER");
        return repoUser.saveUser(u);
    }

    /*
    This method is used by spring to get a user from the database by username,
    and check the credentials [spring is doing that automatically,we just have to provide the method to return
    the user
     */
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repoUser.findByUsername(username);
        if(user == null)
        {
            throw new UsernameNotFoundException("Username or password invalid.");
        }
        //this user implements the interface UserDetails
        return UserDetailsImpl.build(user);
    }

    //Used to transform the role in authorities [used by spring]
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(String role){
         List<SimpleGrantedAuthority> authorities =  new ArrayList<SimpleGrantedAuthority>();
         authorities.add(new SimpleGrantedAuthority(role));
         return authorities;
    }
}
