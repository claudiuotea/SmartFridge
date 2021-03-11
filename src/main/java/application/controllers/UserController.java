package application.controllers;

import application.DTOObjects.JwtResponse;
import application.DTOObjects.UserLoginDTO;
import application.DTOObjects.UserRegisterDTO;
import application.Entities.User;
import application.Entities.UserDetailsImpl;
import application.repositories.RepoUser;
import application.utils.JwtUtils;
import application.utils.ServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RepoUser userRepository;

    @Autowired
    BCryptPasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserLoginDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO signUpRequest) {
        // Create new user's account

        User user = new User();
        user.setRole("USER");
        user.setLastName(signUpRequest.getLastName());
        user.setFirstName(signUpRequest.getFirstName());
        user.setEmail(signUpRequest.getEmail());
        user.setUsername(signUpRequest.getUsername());
        //encode the password
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        try {
            userRepository.saveUser(user);
        }
        catch (ServerException e){
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok("User registered successfully!");
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String error(ServerException e){return e.getMessage();}
}
