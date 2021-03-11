package application.controllers;

import application.DTOObjects.UpdateDTO;
import application.Entities.Aliment;
import application.Entities.FridgeAliment;
import application.DTOObjects.AddFridgeAlimentDTO;
import application.repositories.RepoFridge;
import application.utils.ServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/*
It is used by the fridge. Add/remove/get elements inside/from the fridge
 */
@RestController
@CrossOrigin
@RequestMapping("/fridge")
public class FridgeController {
    @Autowired
    RepoFridge repoFridge;

    @RequestMapping(value = "/{userId}/{fridgeId}", method = RequestMethod.GET)
    public ResponseEntity<?> getById(@PathVariable int userId,@PathVariable int fridgeId){
        Aliment found = repoFridge.findAliment(userId,fridgeId);
        if(found == null)
            return new ResponseEntity<String>("Aliment not found!", HttpStatus.NOT_FOUND);
        else
            return new ResponseEntity<Aliment>(found,HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> addAliment(@RequestBody AddFridgeAlimentDTO post){
        FridgeAliment fridgeAliment = null;
        try{
            fridgeAliment = repoFridge.addAliment(post.getType(),post.getQuantity(),post.getUserId());
            if(fridgeAliment != null)
            return new ResponseEntity<FridgeAliment>(fridgeAliment, HttpStatus.OK);
            else throw new ServerException("Could not add the aliment in the fridge.");
        }
        catch(ServerException e){
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/{userId}/{fridgeId}",method = RequestMethod.PUT)
    public ResponseEntity<String> updateAliment(@RequestBody UpdateDTO u, @PathVariable int userId, @PathVariable int fridgeId){
        repoFridge.updateAliment(u,userId,fridgeId);
        return new ResponseEntity<String>("Done!",HttpStatus.OK);
    }

    @RequestMapping(value = "/{userId}/{fridgeId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable int userId,@PathVariable int fridgeId){
        try{
            repoFridge.removeAliment(userId,fridgeId);
            return new ResponseEntity<Aliment>(HttpStatus.OK);
        }
        catch(ServerException e){
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value ="/{userId}", method = RequestMethod.GET)
    public Aliment[] getAllAliments(@PathVariable int userId){
        return repoFridge.getAllAliments(userId);
    }
    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String error(ServerException e){return e.getMessage();}

}
