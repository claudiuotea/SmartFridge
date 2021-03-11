package application.utils;

import application.Entities.User;
import application.Entities.UserDetailsImpl;
import application.services.UserService;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
@Component
public class JwtUtils {
    @Value("${fridge.app.jwtSecret}")
    private String jwtSecret;
    //get the data from application.properties
    @Value("${fridge.app.jwtExpirationMs}")
    private int jwtExpirationMs;
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);


    //this is generating a jwt token for the user
    public String generateJwtToken(Authentication authentication) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                //.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) GOOD WAY WHEN IMPLEMENTING THE REFRESH TOKEN
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
        /*try{
            validateJwtToken(jwt);//daca este expirata generez un "NOU" token
        }
        catch(ExpiredJwtException e){
            jwt = Jwts.builder()
                    .setSubject((userPrincipal.getUsername()))
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs + 5000l))
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        }*/
        return jwt;
    }

    //get the subject from a token
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    //this method will validate an authentication token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());

        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}